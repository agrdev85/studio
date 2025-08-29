"use server";

// This file is no longer needed as all logic is handled by the backend API.
// It is kept to avoid breaking existing imports, but its functions are deprecated.

export async function handleScoreSubmit() {
  console.warn("handleScoreSubmit is deprecated. Use the /api/scores/submit endpoint.");
  return {
    message: `This form is deprecated. Score submission is handled by the game client.`,
    error: true,
  };
}
