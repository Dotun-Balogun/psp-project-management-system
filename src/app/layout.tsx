import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Plapoly Projects", description: "Student project management for the School of ICT, Plateau State Polytechnic" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}" }} /></head><body className="min-h-screen antialiased">{children}</body></html>;
}
