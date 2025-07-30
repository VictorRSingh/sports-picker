"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sport: string;
  slug: string;
};

const SportDynamicClientPage: React.FC<Props> = async ({ sport, slug }) => {
  const router = useRouter();

  useEffect(() => {
    if (slug.endsWith("-team")) {
      router.push(`/${sport}/t/${slug}`);
    } else if (slug.endsWith("-player")) {
      router.push(`/${sport}/p/${slug}`);
    } else if (slug.includes("-boxscore")) {
      router.push(`/g/${sport}/${slug}`);
    }
  }, [sport, slug, router]);

  return <div>SportDynamicPage: {slug}</div>;
};

export default SportDynamicClientPage;
