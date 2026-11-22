import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
export const metadata: Metadata = { title:"Sports Picker | Analytics", description:"Multi-sport statistics and matchup analysis" };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body className="min-h-screen antialiased"><div className="sticky top-0 z-50 border-b theme-border bg-[#0b1120]/95 backdrop-blur"><Navbar /></div><main className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-6 lg:px-8">{children}</main></body></html>;
}
