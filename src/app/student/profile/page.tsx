import { PageHead } from "@/components/page-head";
import { SimpleForm } from "@/components/blocks";
export default function Page() { return <><PageHead title="Profile" sub="Update the details you are allowed to change." /><SimpleForm submit="Save changes" fields={[["photo","Profile photo","file"],["name","Full name"],["matric","Matric number"],["gender","Gender","select:Male|Female"],["level","Level","select:ND I|ND II|HND I|HND II"],["dept","Department"],["phone","Phone number","tel"],["email","Email","email"]]} /></>; }
