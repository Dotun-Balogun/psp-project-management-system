import { Inbox } from "lucide-react";
import { PageHead } from "./page-head";
import { Card } from "./ui/card";
export const ModulePage = ({ title, sub }: { title: string; sub: string }) => (
  <><PageHead title={title} sub={sub} />
    <Card className="flex flex-col items-center gap-2 p-12 text-center"><Inbox className="text-muted-foreground" /><p className="font-medium">Nothing here yet</p><p className="max-w-sm text-sm text-muted-foreground">Records will appear here once they are created.</p></Card></>
);
