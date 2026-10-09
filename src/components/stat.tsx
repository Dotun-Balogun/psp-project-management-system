import { Card } from "./ui/card";
export const Stat = ({ label, value, bar }: { label: string; value: string; bar: string }) => <Card className={`border-l-4 p-5 ${bar}`}><p className="font-display text-3xl">{value}</p><p className="text-sm text-muted-foreground">{label}</p></Card>;
