import type { TournamentWithRelations } from "@/lib/types";
import { TournamentCard } from "./TournamentCard";

interface TournamentListProps {
  tournaments: TournamentWithRelations[];
}

export function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <h3 className="text-xl font-headline">No Active Tournaments</h3>
        <p>Check back later for new events!</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
