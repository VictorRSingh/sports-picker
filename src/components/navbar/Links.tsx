"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Links as links } from "../../../public/data/NavLinks";
import { IoMenu, IoClose } from "react-icons/io5";
export default function Links(){const [open,setOpen]=useState(false);const pathname=usePathname();return <nav className="relative"><div className="hidden items-center gap-1 md:flex">{links.map(link=><Link key={link.path} href={link.path} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname===link.path?"theme-accent-bg text-white":"theme-text-soft theme-hover-surface hover:text-white"}`}>{link.name}</Link>)}</div><button type="button" aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded-lg border theme-border p-2 theme-text-soft md:hidden">{open?<IoClose size={22}/>:<IoMenu size={22}/>}</button>{open&&<div className="absolute right-0 top-12 z-50 flex min-w-44 flex-col gap-1 rounded-xl border theme-border theme-surface p-2 shadow-xl md:hidden">{links.map(link=><Link key={link.path} href={link.path} onClick={()=>setOpen(false)} className={`rounded-lg px-4 py-2 text-sm ${pathname===link.path?"theme-accent-bg text-white":"theme-hover-surface"}`}>{link.name}</Link>)}</div>}</nav>}
