import { Question } from "@/entities/question";
import { Answer } from "@/entities/answer";
import { ResultPattern } from "@/entities/resultPattern";
import { QuestionAnswer } from "@/entities/questionAnswer";

/**
 * アンケートフォームのプロパティ
 */
export type SurveyFormProps = {
  userId: string;
  userName: string;
};

/**
 * 個性結果表示コンポーネントのプロパティ
 */
export type PersonalityResultProps = {
  userAnswers: Answer[];
  pattern: ResultPattern | undefined;
  questionAnswers: QuestionAnswer[];
  questions: Question[];
};

/**
 * 質問ごとのパーソナライズ回答のプロパティ
 */
export type QuestionPersonalizedAnswerProps = {
  questionAnswer: QuestionAnswer;
};

/**
 * 結果リストのプロパティ
 */
export type ResultListProps = {
  questions: Question[];
};

/**
 * アンケート進捗データ（LocalStorage用）
 */
export type SurveyProgress = {
  currentQuestionIndex: number;
  showResults: boolean;
  completed: boolean;
  userAnswers: Answer[];
  selectedOption: string | undefined;
  matchedPatternId: string | undefined;
  currentQuestionAnswerId: string | undefined;
};

/**
 * 回答詳細（質問と回答のマッチング結果）
 */
export type AnswerDetail = {
  answer: Answer;
  question?: Question;
  questionAnswer: QuestionAnswer | undefined;
};
