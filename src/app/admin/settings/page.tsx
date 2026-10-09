import { PageHead } from "@/components/page-head";
import { SimpleForm } from "@/components/blocks";
export default function Page() { return <><PageHead title="Settings" sub="Change these without touching the code." /><SimpleForm submit="Save settings" fields={[["session","Academic session"],["deadline","Chapter submission deadline","date"],["milestones","Milestone names (one per line)","textarea"],["departments","Departments (one per line)","textarea"]]} /></>; }
