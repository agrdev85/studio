"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { handleScoreSubmit } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const initialState = {
  message: "",
  error: false,
};

function SubmitButton() {
    return (
      <Button type="submit" className="w-full font-bold bg-accent hover:bg-accent/90 hover:shadow-glow-accent transition-all duration-300">
        <Send className="mr-2 h-4 w-4"/>
        Submit Score
      </Button>
    );
  }

export function ScoreSubmission() {
  const [state, formAction] = useFormState(handleScoreSubmit, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? "Submission Failed" : "Submission Successful",
        description: state.message,
        variant: state.error ? "destructive" : "default",
      });
      if (!state.error) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl tracking-widest text-center uppercase text-accent">Submit Your Score</CardTitle>
        <CardDescription className="text-center font-body">
          Finished a free-play match? Submit your score here to see how you stack up.
          The AI will validate your submission for fairness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <Input
            name="score"
            type="number"
            placeholder="Enter your score"
            required
            className="text-center text-lg h-12"
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
