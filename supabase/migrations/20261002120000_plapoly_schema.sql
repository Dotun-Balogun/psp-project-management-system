create extension if not exists pg_trgm;
create type user_role as enum ('student','supervisor','admin');
create type topic_status as enum ('pending','approved','rejected');
create type doc_status as enum ('submitted','under_review','approved','needs_revision');
create sequence supervisor_seq;

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'student',
  full_name text not null default '', email text not null,
  matric_no text unique check (matric_no is null or matric_no ~ '^PSP/SICT/[A-Z]{3}[0-9]?/(ND|HND)/[0-9]{2}/[0-9]{4}$'),
  supervisor_code text unique,
  gender text check (gender in ('Male','Female')), level text, department text, phone text, photo_path text,
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz default now());
create table supervisor_assignments (student_id uuid primary key references profiles on delete cascade, supervisor_id uuid not null references profiles on delete cascade, created_at timestamptz default now());
create table topics (id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles on delete cascade, title text not null, description text not null, status topic_status not null default 'pending', review_comment text, created_at timestamptz default now(), reviewed_at timestamptz);
create index topics_title_trgm on topics using gin (title gin_trgm_ops);
create table documents (id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles on delete cascade, kind text not null, version int not null default 1, file_path text, status doc_status not null default 'submitted', created_at timestamptz default now(), unique (student_id, kind, version));
create table feedback (id uuid primary key default gen_random_uuid(), document_id uuid references documents on delete cascade, topic_id uuid references topics on delete cascade, author_id uuid not null references profiles, comment text not null, read boolean default false, created_at timestamptz default now());
create table messages (id uuid primary key default gen_random_uuid(), sender_id uuid not null references profiles, recipient_id uuid not null references profiles, body text not null, read boolean default false, created_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade, title text not null, body text, read boolean default false, created_at timestamptz default now());
create table activity_logs (id bigserial primary key, actor_id uuid, action text not null, record text, created_at timestamptz default now());
create table announcements (id uuid primary key default gen_random_uuid(), audience text not null check (audience in ('students','supervisors')), title text not null, body text not null, created_by uuid references profiles, created_at timestamptz default now());
create table settings (key text primary key, value jsonb not null);

create function my_role() returns user_role language sql stable security definer set search_path = public as $$ select role from profiles where id = auth.uid() $$;
create function is_my_student(s uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from supervisor_assignments where student_id = s and supervisor_id = auth.uid()) $$;
create function similar_topics(t text) returns table (title text, sim real) language sql stable security definer set search_path = public as $$ select title, similarity(title, t) from topics where similarity(title, t) > 0.5 order by 2 desc limit 3 $$;

-- Role rules: app_metadata is server-only (seed script). Invited users (invited_at set) may take the role from the invite. Everyone else is a student.
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'); r user_role;
begin
  r := coalesce(nullif(new.raw_app_meta_data->>'role','')::user_role,
    case when new.invited_at is not null and (m->>'role') in ('supervisor','admin') then (m->>'role')::user_role else 'student' end);
  insert into profiles (id, role, full_name, email, matric_no, gender, level, department, phone, supervisor_code)
  values (new.id, r, coalesce(m->>'full_name',''), new.email,
    case when r = 'student' then upper(nullif(m->>'matric_no','')) end,
    nullif(m->>'gender',''), m->>'level', m->>'department', m->>'phone',
    case when r = 'supervisor' then 'PSP-SUP-ICT-' || lpad(nextval('supervisor_seq')::text, 3, '0') end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function log_topic() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into activity_logs (actor_id, action, record) values (auth.uid(), case tg_op when 'INSERT' then 'Submitted topic' else 'Topic ' || new.status end, new.title); return new; end $$;
create trigger topics_log after insert or update on topics for each row execute function log_topic();

alter table profiles enable row level security; alter table supervisor_assignments enable row level security; alter table topics enable row level security;
alter table documents enable row level security; alter table feedback enable row level security; alter table messages enable row level security;
alter table notifications enable row level security; alter table activity_logs enable row level security; alter table announcements enable row level security; alter table settings enable row level security;

create policy p_read on profiles for select using (id = auth.uid() or my_role() = 'admin' or is_my_student(id) or id in (select supervisor_id from supervisor_assignments where student_id = auth.uid()));
create policy p_self on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = my_role());
create policy p_admin on profiles for update using (my_role() = 'admin');
create policy a_read on supervisor_assignments for select using (student_id = auth.uid() or supervisor_id = auth.uid() or my_role() = 'admin');
create policy a_admin on supervisor_assignments for all using (my_role() = 'admin') with check (my_role() = 'admin');
create policy t_student on topics for select using (student_id = auth.uid());
create policy t_insert on topics for insert with check (student_id = auth.uid() and status = 'pending' and my_role() = 'student');
create policy t_resubmit on topics for update using (student_id = auth.uid() and status = 'rejected') with check (student_id = auth.uid() and status = 'pending');
create policy t_staff on topics for select using (my_role() = 'admin' or is_my_student(student_id));
create policy t_review on topics for update using (is_my_student(student_id)) with check (is_my_student(student_id));
create policy d_student on documents for select using (student_id = auth.uid());
create policy d_insert on documents for insert with check (student_id = auth.uid());
create policy d_staff on documents for select using (my_role() = 'admin' or is_my_student(student_id));
create policy d_review on documents for update using (is_my_student(student_id));
create policy f_read on feedback for select using (author_id = auth.uid() or my_role() = 'admin' or exists (select 1 from documents d where d.id = document_id and d.student_id = auth.uid()) or exists (select 1 from topics t where t.id = topic_id and t.student_id = auth.uid()));
create policy f_write on feedback for insert with check (author_id = auth.uid() and my_role() in ('supervisor','admin'));
create policy m_read on messages for select using (sender_id = auth.uid() or recipient_id = auth.uid());
create policy m_write on messages for insert with check (sender_id = auth.uid());
create policy m_mark on messages for update using (recipient_id = auth.uid());
create policy n_own on notifications for select using (user_id = auth.uid());
create policy n_mark on notifications for update using (user_id = auth.uid());
create policy n_write on notifications for insert with check (my_role() in ('supervisor','admin'));
create policy l_admin on activity_logs for select using (my_role() = 'admin');
create policy an_read on announcements for select using (auth.uid() is not null);
create policy an_admin on announcements for all using (my_role() = 'admin') with check (my_role() = 'admin');
create policy s_read on settings for select using (auth.uid() is not null);
create policy s_admin on settings for all using (my_role() = 'admin') with check (my_role() = 'admin');

insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false) on conflict do nothing;
create policy o_insert on storage.objects for insert to authenticated with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy o_read on storage.objects for select to authenticated using (bucket_id = 'project-files' and ((storage.foldername(name))[1] = auth.uid()::text or my_role() = 'admin' or is_my_student(((storage.foldername(name))[1])::uuid)));
