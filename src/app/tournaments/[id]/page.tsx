import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { JoinTournamentDialog } from "@/components/tournaments/JoinTournamentDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTournaments, tournamentScores } from "@/lib/mock-data";
import { CircleDollarSign, Clock, Swords, Trophy, Users } from "lucide-react";
import { notFound } from "next/navigation";

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  const tournament = mockTournaments.find(t => t.id.toString() === params.id);

  if (!tournament) {
    notFound();
  }
  
  const isFull = tournament.currentPlayers === tournament.maxPlayers;

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
                  {tournament.isActive ? (
                    <Badge variant="outline" className="border-green-400 text-green-400 font-bold uppercase">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Finished</Badge>
                  )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-body">
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Trophy className="w-8 h-8 text-amber-400" />
                <span className="text-sm text-muted-foreground">Prize Pool</span>
                <span className="font-headline text-2xl font-bold">${tournament.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <CircleDollarSign className="w-8 h-8 text-green-400" />
                <span className="text-sm text-muted-foreground">Entry Fee</span>
                <span className="font-headline text-2xl font-bold">{tournament.registrationFee} USDT</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-muted-foreground">Players</span>
                <span className="font-headline text-2xl font-bold">{tournament.currentPlayers} / {tournament.maxPlayers}</span>
              </div>
               <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                <Clock className="w-8 h-8 text-red-400" />
                <span className="text-sm text-muted-foreground">Ends In</span>
                <span className="font-headline text-2xl font-bold">2d 4h</span>
              </div>
            </CardContent>
          </Card>

          <LeaderboardTable title="Tournament Leaderboard" scores={tournamentScores} />
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
                        fee={tournament.registrationFee} 
                        disabled={!tournament.isActive || isFull} 
                        disabledText={!tournament.isActive ? "Registration Closed" : "Tournament Full"}
                    />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
