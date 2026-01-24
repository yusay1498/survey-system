import { Answer } from "@/entities/answer";
import { ResultPattern } from "@/entities/resultPattern";

/**
 * Find the best matching result pattern based on user's answers.
 * 
 * @param userAnswers - All answers submitted by the user
 * @param patterns - Available result patterns to match against
 * @returns The matching pattern or null if no match found
 */
export function findMatchingPattern(
  userAnswers: Answer[],
  patterns: ResultPattern[]
): ResultPattern | null {
  // Return null if there are no answers to match against
  if (userAnswers.length === 0) return null;
  if (patterns.length === 0) return null;

  // Sort by priority (desc) then by specificity (more conditions = more specific)
  const sorted = [...patterns].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.conditions.length - a.conditions.length;
  });

  for (const pattern of sorted) {
    // Skip patterns with empty conditions (would match everything)
    if (pattern.conditions.length === 0) {
      continue;
    }

    // Check if ALL conditions are met
    const isMatched = pattern.conditions.every((condition) =>
      userAnswers.some(
        (answer) =>
          answer.questionId === condition.questionId &&
          answer.selectedOption === condition.selectedOption
      )
    );

    if (isMatched) return pattern;
  }

  // No matching pattern found; return null
  return null;
}
