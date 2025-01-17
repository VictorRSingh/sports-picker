import { Link } from "@/interfaces/ILink";
import React from "react";
import { useRouter } from "next/navigation";

interface HeroProps {
  heading: string;
  description: string;
  buttons?: Link[];
}

const Hero = ({ heading, description, buttons }: HeroProps) => {
    const router = useRouter();
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-3xl">{heading}</h1>
        <p className="text-xl">{description}</p>
        <div className="flex gap-x-2">
          {buttons?.map((button, index) => (
            <button key={index} className="px-4 py-2 border" onClick={() => router.push(button.path)}>{button.name.toUpperCase()} Matchups</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
