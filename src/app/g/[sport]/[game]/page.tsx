import { redirect } from "next/navigation";
export default async function LegacyGamePage({params}:{params:Promise<{sport:string;game:string}>}) {
 const {sport,game}=await params;
 redirect(`/${encodeURIComponent(sport)}/game?webUrl=${encodeURIComponent(decodeURIComponent(game))}`);
}
