import { Question } from "@/entities/question";
import { QuestionAnswer } from "@/entities/questionAnswer";
import { ResultPattern } from "@/entities/resultPattern";

/**
 * 管理者ダッシュボードのプロパティ
 */
export type AdminDashboardProps = {
  userEmail: string | null;
  userId: string;
  onLogout: () => void;
};

/**
 * 管理者ヘッダーのプロパティ
 */
export type AdminHeaderProps = {
  email: string | null;
  userId: string;
  onLogout: () => void;
};

/**
 * 質問管理コンポーネントのプロパティ
 */
export type QuestionManagerProps = {
  questions: Question[];
  onUpdate: () => void;
};

/**
 * 質問回答パターン管理コンポーネントのプロパティ
 */
export type QuestionAnswerManagerProps = {
  questionAnswers: QuestionAnswer[];
  questions: Question[];
  onUpdate: () => void;
};

/**
 * 結果パターン管理コンポーネントのプロパティ
 */
export type ResultPatternManagerProps = {
  patterns: ResultPattern[];
  questions: Question[];
  onUpdate: () => void;
};

/**
 * 質問フォームデータ
 */
export type QuestionFormData = {
  text: string;
  options: string[];
  order: number;
};

/**
 * 質問回答パターンフォームデータ
 */
export type QuestionAnswerFormData = {
  questionId: string;
  name: string;
  message: string;
  description: string;
  condition: {
    selectedOption: string;
  };
  order: number;
};

/**
 * 結果パターンフォームデータ
 */
export type ResultPatternFormData = {
  name: string;
  message: string;
  description: string;
  conditions: Array<{
    questionId: string;
    selectedOption: string;
  }>;
  priority: number;
  order: number;
};
