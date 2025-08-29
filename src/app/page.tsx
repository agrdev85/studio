import { HeroSection } from "@/components/home/HeroSection";
import { ScoreSubmission } from "@/components/home/ScoreSubmission";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { TournamentList } from "@/components/tournaments/TournamentList";
import { globalScores, mockTournaments } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <div className="mt-16 space-y-24">
        <section id="tournaments">
          <h2 className="mb-8 text-4xl font-headline tracking-widest text-center uppercase text-primary">Active Tournaments</h2>
          <TournamentList tournaments={mockTournaments} />
        </section>

        <section id="leaderboard" className="max-w-4xl mx-auto">
          <LeaderboardTable title="Global Leaderboard" scores={globalScores} />
        </section>

        <section id="submit-score" className="max-w-2xl mx-auto">
          <ScoreSubmission />
        </section>
      </div>
    </div>
  );
}
