import { PageHead } from "@/components/page-head";
import { SimpleForm } from "@/components/blocks";
export default function Page() { return <><PageHead title="Profile" sub="Supervisor ID: PSP-SUP-ICT-001" /><SimpleForm submit="Save changes" fields={[["photo","Profile photo","file"],["name","Full name"],["gender","Gender","select:Male|Female"],["dept","Department"],["email","Email","email"],["phone","Phone","tel"]]} /></>; }
