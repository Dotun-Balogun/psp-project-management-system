import Link from "next/link";
import { Crest } from "@/components/crest";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"><Crest size={72} /><h1 className="font-display text-3xl">Page not found</h1><p className="text-muted-foreground">The page you opened does not exist or has moved.</p><Button asChild><Link href="/">Back to home</Link></Button></main>;
}
