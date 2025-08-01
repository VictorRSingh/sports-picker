// components/sport/SportDynamicClientPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sport: string;
  slug: string;
};

export default function SportDynamicClientPage({ sport, slug }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (slug.endsWith("-team")) {
      router.push(`/t/${sport}/${slug}`);
    } else if (slug.endsWith("-player")) {
      router.push(`/p/${sport}/${slug}`);
    } else if (slug.includes("-boxscore")) {
      router.push(`/g/${sport}/${slug}`);
    }
  }, [sport, slug, router]);

  return <div>Redirecting: {slug}</div>;
}