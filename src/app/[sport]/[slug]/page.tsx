import SportDynamicClientPage from "@/components/sport/SportDynamicClientPage";

export default async function SportDynamicPage({ params }: { params: { sport: string; slug: string } }) {
  return <SportDynamicClientPage sport={params.sport} slug={params.slug} />;
}
