import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { JoinTournamentDialog } from "@/components/tournaments/JoinTournamentDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTournamentById, getTournamentScores } from "@/lib/api";
import { CircleDollarSign, Clock, Swords, Trophy, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const tournamentId = parseInt(params.id, 10);
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournament = await getTournamentById(tournamentId);

  if (!tournament) {
    notFound();
  }
  
  const isFull = tournament.maxPlayers ? tournament.registrations.length >= tournament.maxPlayers : false;

  function getTournamentStatus(t: typeof tournament) : { text: string; className: string; } {
      const now = new Date();
      if (!t.isActive) return { text: 'Finished', className: 'border-red-400 text-red-400' };
      if (t.startDate && new Date(t.startDate) > now) return { text: 'Upcoming', className: 'border-yellow-400 text-yellow-400' };
      if (t.endDate && new Date(t.endDate) < now) return { text: 'Finished', className: 'border-red-400 text-red-400' };
      if (t.startDate) return { text: 'In Progress', className: 'border-green-400 text-green-400' };
      return { text: 'Open', className: 'border-cyan-400 text-cyan-400' };
  }

  const status = getTournamentStatus(tournament);

  function getTimeRemaining(endDate: string | null): string {
    if (!endDate) return 'N/A';
    const diff = new Date(endDate).getTime() - new Date().getTime();
    if (diff <= 0) return 'Finished';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="font-headline text-4xl text-primary tracking-wider">{tournament.name}</CardTitle>
                      <CardDescription className="font-body text-lg pt-2">{tournament.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`font-bold uppercase ${status.className}`}>{status.text}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-body">
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Trophy className="w-8 h-8 text-amber-400" />
                <span className="text-sm text-muted-foreground">Prize Pool</span>
                <span className="font-headline text-2xl font-bold">${tournament.currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <CircleDollarSign className="w-8 h-8 text-green-400" />
                <span className="text-sm text-muted-foreground">Entry Fee</span>
                <span className="font-headline text-2xl font-bold">{tournament.registrationFee} USDT</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-muted-foreground">Players</span>
                <span className="font-headline text-2xl font-bold">{tournament.registrations.length} / {tournament.maxPlayers ?? '∞'}</span>
              </div>
               <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Clock className="w-8 h-8 text-red-400" />
                <span className="text-sm text-muted-foreground">Ends In</span>
                <span className="font-headline text-2xl font-bold">{getTimeRemaining(tournament.endDate)}</span>
              </div>
            </CardContent>
          </Card>

           <Suspense fallback={<Skeleton className="h-96 w-full" />}>
             <TournamentLeaderboard tournamentId={tournamentId} />
           </Suspense>

        </div>

        <div className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Swords className="text-accent"/> Join the Fray</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-body text-muted-foreground mb-4">
                        To join this tournament, submit a payment of <strong>{tournament.registrationFee} USDT (TRC20)</strong> to the tournament wallet and enter the transaction hash below for verification.
                    </p>
                    <JoinTournamentDialog 
                        tournamentId={tournament.id}
                        fee={tournament.registrationFee} 
                        disabled={!tournament.isActive || isFull} 
                        disabledText={!tournament.isActive ? "Registration Closed" : (isFull ? "Tournament Full" : "Join")}
                    />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


async function TournamentLeaderboard({ tournamentId }: { tournamentId: number }) {
  const scores = await getTournamentScores(tournamentId);
  return <LeaderboardTable title="Tournament Leaderboard" scores={scores} />
}
