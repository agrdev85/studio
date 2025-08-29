import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Score } from "@/lib/types";
import { PodiumIcon } from "../icons/PodiumIcons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface LeaderboardTableProps {
  title: string;
  scores: Score[];
}

export function LeaderboardTable({ title, scores }: LeaderboardTableProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl tracking-widest text-center uppercase">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="font-headline uppercase tracking-wider text-sm hover:bg-transparent">
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.rank} className="font-body text-base hover:bg-primary/10">
                <TableCell className="font-bold text-lg text-center">
                  <div className="flex justify-center items-center">
                    {score.rank <= 3 ? (
                      <PodiumIcon rank={score.rank} />
                    ) : (
                      score.rank
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={score.user.avatarUrl} alt={score.user.username} data-ai-hint="avatar gaming" />
                      <AvatarFallback>{score.user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{score.user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-primary text-lg">
                  {score.value.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
