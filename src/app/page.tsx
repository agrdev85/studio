import { HeroSection } from "@/components/home/HeroSection";
import { ScoreSubmission } from "@/components/home/ScoreSubmission";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { TournamentList } from "@/components/tournaments/TournamentList";
import { getGlobalScores, getTournaments } from "@/lib/api";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function Tournaments() {
  const tournaments = await getTournaments();
  return <TournamentList tournaments={tournaments} />;
}

async function GlobalLeaderboard() {
    const scores = await getGlobalScores();
    return <LeaderboardTable title="Global Leaderboard" scores={scores} />
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <div className="mt-16 space-y-24">
        <section id="tournaments">
          <h2 className="mb-8 text-4xl font-headline tracking-widest text-center uppercase text-primary">Active Tournaments</h2>
          <Suspense fallback={<TournamentListSkeleton />}>
            <Tournaments />
          </Suspense>
        </section>

        <section id="leaderboard" className="max-w-4xl mx-auto">
          <Suspense fallback={<LeaderboardSkeleton />}>
            <GlobalLeaderboard />
          </Suspense>
        </section>

        <section id="submit-score" className="max-w-2xl mx-auto">
          <ScoreSubmission />
        </section>
      </div>
    </div>
  );
}

function TournamentListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[450px] w-full" />
      ))}
    </div>
  );
}

function LeaderboardSkeleton() {
    return <Skeleton className="h-[500px] w-full" />
}
