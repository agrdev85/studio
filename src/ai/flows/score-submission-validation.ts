'use server';

/**
 * @fileOverview Flow for validating and submitting user scores.
 *
 * - submitScoreWithValidation - A function that handles the submission and validation of user scores.
 * - SubmitScoreWithValidationInput - The input type for the submitScoreWithValidation function.
 * - SubmitScoreWithValidationOutput - The return type for the submitScoreWithValidation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubmitScoreWithValidationInputSchema = z.object({
  userId: z.number().describe('The ID of the user submitting the score.'),
  tournamentId: z.number().optional().describe('The ID of the tournament, if applicable.'),
  value: z.number().describe('The score value.'),
  mode: z.string().describe('The game mode (e.g., free, tournament).'),
});

export type SubmitScoreWithValidationInput = z.infer<typeof SubmitScoreWithValidationInputSchema>;

const SubmitScoreWithValidationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the score is valid.'),
  reason: z.string().optional().describe('The reason the score is invalid, if applicable.'),
});

export type SubmitScoreWithValidationOutput = z.infer<typeof SubmitScoreWithValidationOutputSchema>;

export async function submitScoreWithValidation(input: SubmitScoreWithValidationInput): Promise<SubmitScoreWithValidationOutput> {
  return submitScoreWithValidationFlow(input);
}

const validateScorePrompt = ai.definePrompt({
  name: 'validateScorePrompt',
  input: {schema: SubmitScoreWithValidationInputSchema},
  output: {schema: SubmitScoreWithValidationOutputSchema},
  prompt: `You are an expert game score validator.  Given a user's score submission, you must determine if it is a valid score.

  Here are the details of the score submission:
  User ID: {{{userId}}}
  Tournament ID: {{{tournamentId}}}
  Score Value: {{{value}}}
  Game Mode: {{{mode}}}

  Consider the following when validating the score:
  - Is the score within a reasonable range for the given game mode?
  - Is there any indication of cheating or exploitation?
  - Could the score have been achieved legitimately?

  Return a JSON object indicating whether the score is valid and, if not, the reason for the rejection.
  `,
});

const submitScoreWithValidationFlow = ai.defineFlow(
  {
    name: 'submitScoreWithValidationFlow',
    inputSchema: SubmitScoreWithValidationInputSchema,
    outputSchema: SubmitScoreWithValidationOutputSchema,
  },
  async input => {
    const {output} = await validateScorePrompt(input);
    return output!;
  }
);
