"use server";

import { submitScoreWithValidation } from "@/ai/flows/score-submission-validation";
import { z } from "zod";

const scoreSchema = z.object({
  score: z.coerce.number().int().min(0, "Score must be a positive number."),
});

type FormState = {
  message: string;
  error: boolean;
};

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

  try {
    // In a real app, you would get the user ID from the session
    const mockUserId = Math.floor(Math.random() * 1000);

    const result = await submitScoreWithValidation({
      userId: mockUserId,
      value: validatedFields.data.score,
      mode: "free",
    });

    if (result.isValid) {
      return {
        message: `Score of ${validatedFields.data.score} submitted successfully! It is now on the global leaderboard.`,
        error: false,
      };
    } else {
      return {
        message: `Invalid Score: ${result.reason || "The score was rejected by our anti-cheat system."}`,
        error: true,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      message: "An unexpected error occurred on the server.",
      error: true,
    };
  }
}
