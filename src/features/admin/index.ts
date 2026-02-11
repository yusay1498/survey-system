// Admin API exports
export { createQuestion } from "./api/createQuestion";
export { updateQuestion } from "./api/updateQuestion";
export { deleteQuestion } from "./api/deleteQuestion";
export { createQuestionAnswer } from "./api/createQuestionAnswer";
export { updateQuestionAnswer } from "./api/updateQuestionAnswer";
export { deleteQuestionAnswer } from "./api/deleteQuestionAnswer";
export { createResultPattern } from "./api/createResultPattern";
export { updateResultPattern } from "./api/updateResultPattern";
export { deleteResultPattern } from "./api/deleteResultPattern";
export { isAdmin } from "./api/isAdmin";

// Admin Hooks exports
export { useAdminAccess } from "./hooks/useAdminAccess";
export type { AdminAccessState } from "./hooks/useAdminAccess";

// Admin Components exports
export { AdminDashboard } from "./components/AdminDashboard";
export { AdminHeader } from "./components/AdminHeader";
export { AdminMenu } from "./components/AdminMenu";
export { QuestionEditScreen } from "./components/QuestionEditScreen";
export { ResultScreen } from "./components/ResultScreen";
export { QuestionManager } from "./components/QuestionManager";
export { QuestionAnswerManager } from "./components/QuestionAnswerManager";
export { ResultPatternManager } from "./components/ResultPatternManager";
export { UnauthorizedAccess } from "./components/UnauthorizedAccess";

// Admin Types exports
export type {
  AdminDashboardProps,
  AdminHeaderProps,
  QuestionManagerProps,
  QuestionAnswerManagerProps,
  ResultPatternManagerProps,
  QuestionFormData,
  QuestionAnswerFormData,
  ResultPatternFormData,
} from "./types";
