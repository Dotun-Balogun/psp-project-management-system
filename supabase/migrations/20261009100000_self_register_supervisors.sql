-- Supervisors now self-register. Admins still come only from app_metadata (seed) or an admin invite.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'); r user_role;
begin
  r := coalesce(nullif(new.raw_app_meta_data->>'role','')::user_role,
    case when new.invited_at is not null and (m->>'role') = 'admin' then 'admin'::user_role
         when (m->>'role') = 'supervisor' then 'supervisor'::user_role
         else 'student'::user_role end);
  insert into profiles (id, role, full_name, email, matric_no, gender, level, department, phone, supervisor_code)
  values (new.id, r, coalesce(m->>'full_name',''), new.email,
    case when r = 'student' then upper(nullif(m->>'matric_no','')) end,
    nullif(m->>'gender',''), nullif(m->>'level',''), m->>'department', m->>'phone',
    case when r = 'supervisor' then 'PSP-SUP-ICT-' || lpad(nextval('supervisor_seq')::text, 3, '0') end);
  return new;
end $$;
