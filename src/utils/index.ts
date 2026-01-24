// Validation utilities
export {
  validateQuestionForm,
  validateQuestionAnswerForm,
  validateResultPatternForm,
  isNonEmptyString,
  hasMinLength,
} from "./validation/formValidators";

// Error handling utilities
export { handleError, withErrorHandling, confirmAction } from "./errorHandling";

// Custom hooks
export { useAsyncData, useLocalStorage, useCRUDManager } from "./hooks";
