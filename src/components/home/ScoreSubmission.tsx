"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ScoreSubmission() {

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl tracking-widest text-center uppercase text-accent">Submit Your Score</CardTitle>
        <CardDescription className="text-center font-body">
          Score submission is handled automatically by the CUFIRE game client. 
          Finish a match in-game to see your score on the leaderboards!
        </CardDescription>
      </CardHeader>
      <CardContent>
         <p className="text-center text-muted-foreground font-bold text-lg">GLHF!</p>
      </CardContent>
    </Card>
  );
}
