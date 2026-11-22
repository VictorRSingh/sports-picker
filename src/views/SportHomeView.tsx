import ScheduleCard from "@/components/schedule/ScheduleCard";
import CompactStandings from "@/components/standings/CompactStandings";
export default function SportHomeView({ sport }: { sport: string }) {
  return <div className="w-full pb-8"><ScheduleCard sport={sport} sidebar={<CompactStandings sport={sport} />} /></div>;
}
