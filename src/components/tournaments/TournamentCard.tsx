import type { TournamentWithRelations } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, CircleDollarSign, Badge } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TournamentCardProps {
  tournament: TournamentWithRelations;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isFull = tournament.maxPlayers ? tournament.registrations.length >= tournament.maxPlayers : false;
  const progress = tournament.maxPlayers ? (tournament.registrations.length / tournament.maxPlayers) * 100 : 0;

  function getTournamentStatus(t: TournamentWithRelations): { text: string; className: string } {
      const now = new Date();
      if (!t.isActive) return { text: 'Finished', className: 'text-red-400 bg-red-500/10' };
      if (t.startDate && new Date(t.startDate) > now) return { text: 'Upcoming', className: 'text-yellow-400 bg-yellow-500/10' };
      if (t.endDate && new Date(t.endDate) < now) return { text: 'Finished', className: 'text-red-400 bg-red-500/10' };
      if (t.startDate) return { text: 'In Progress', className: 'text-green-400 bg-green-500/10' };
      return { text: 'Open', className: 'text-cyan-400 bg-cyan-500/10' };
  }

  const status = getTournamentStatus(tournament);

  return (
    <Link href={`/tournaments/${tournament.id}`} className="group block">
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/80 transition-all duration-300 overflow-hidden h-full flex flex-col relative group-hover:shadow-glow-primary">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary tracking-wide flex justify-between items-center">
            {tournament.name}
            <span className={`text-xs font-body font-bold uppercase tracking-widest px-2 py-1 rounded-full ${status.className}`}>{status.text}</span>
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground pt-2 h-12">
            {tournament.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 font-body">
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2 text-sm"><Trophy className="w-4 h-4 text-amber-400" /> Prize Pool</span>
            <span className="font-bold text-lg text-amber-400">${tournament.currentAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2 text-sm"><CircleDollarSign className="w-4 h-4 text-green-400" /> Entry Fee</span>
            <span className="font-bold text-lg">{tournament.registrationFee} USDT</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Players</span>
              <span>{tournament.registrations.length} / {tournament.maxPlayers ?? '∞'}</span>
            </div>
            {tournament.maxPlayers && <Progress value={progress} className="h-2 [&>div]:bg-primary" />}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full font-bold text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
            disabled={!tournament.isActive || isFull}
          >
            {tournament.isActive ? (isFull ? 'Tournament Full' : 'View Tournament') : 'View Results'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
