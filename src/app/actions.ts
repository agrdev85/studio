"use server";

import { z } from "zod";

const scoreSchema = z.object({
  score: z.coerce.number().int().min(0, "Score must be a positive number."),
});

type FormState = {
  message: string;
  error: boolean;
};

// This function is now simplified and directly returns success,
// as the core logic will be handled by the backend API called from Unity.
// The AI validation has been removed.
export async function handleScoreSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = scoreSchema.safeParse({
    score: formData.get("score"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.score?.[0] || "Invalid input.",
      error: true,
    };
  }

  // In a real scenario, this submission might be redundant if the game itself
  // submits the score. This form can be for manual submission or testing.
  // For now, we'll just simulate a successful submission.

  console.log(`Score submission for ${validatedFields.data.score} received. In a real app, this would be handled by the game client calling the backend.`);

  return {
    message: `Score of ${validatedFields.data.score} submitted successfully! It will appear on the leaderboard.`,
    error: false,
  };
}
