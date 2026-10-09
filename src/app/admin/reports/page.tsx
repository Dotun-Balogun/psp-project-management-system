import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const r = [["Student report","All students with level, gender and status."],["Supervisor workload","Students per supervisor."],["Topic status","Approved, pending and rejected topics."],["Project progress","Stage reached by every project."]];
export default function Page() { return <><PageHead title="Reports" sub="Export department reports." /><div className="grid gap-4 sm:grid-cols-2">{r.map(([t, d]) => <Card key={t} className="p-5"><p className="font-display text-lg">{t}</p><p className="mb-4 text-sm text-muted-foreground">{d}</p><div className="flex gap-2"><Button variant="outline" size="sm">Export CSV</Button><Button variant="dark" size="sm">Export PDF</Button></div></Card>)}</div></>; }
