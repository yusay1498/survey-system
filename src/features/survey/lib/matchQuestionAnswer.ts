import { QuestionAnswer } from "@/entities/questionAnswer";

/**
 * 指定された質問IDと選択された回答に基づいて、マッチするQuestionAnswerを検索
 * 
 * @param questionId - 質問のID
 * @param selectedOption - 選択された回答
 * @param questionAnswers - 利用可能な質問回答パターンのリスト
 * @returns マッチした質問回答パターン、またはnull
 */
export function findMatchingQuestionAnswer(
  questionId: string,
  selectedOption: string,
  questionAnswers: QuestionAnswer[]
): QuestionAnswer | null {
  // 該当する質問IDのパターンのみをフィルタ
  const matchingAnswers = questionAnswers.filter(
    (qa) => qa.questionId === questionId && qa.condition.selectedOption === selectedOption
  );

  if (matchingAnswers.length === 0) {
    return null;
  }

  // orderの小さい順に並べて最初のものを返す
  matchingAnswers.sort((a, b) => a.order - b.order);
  return matchingAnswers[0];
}
