"use client";
import Link from "next/link";
import Logo from "./Logo";
import Links from "./Links";
import SearchBar from "./SearchBar";
export default function Navbar(){return <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-3 py-3 sm:px-6 lg:px-8"><Link href="/" className="shrink-0"><Logo /></Link><div className="order-3 w-full lg:order-none lg:ml-auto lg:w-64"><SearchBar /></div><div className="ml-auto lg:ml-0"><Links /></div></div>}
