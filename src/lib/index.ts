// Firestore helpers
export {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getCollection,
  documentExists,
} from "./firestore/helpers";

// Constants
export {
  COLLECTIONS,
  VALIDATION_MESSAGES,
  CONFIRMATION_MESSAGES,
  ERROR_MESSAGES,
  UI_CONSTANTS,
} from "./constants";

// Firebase core
export { auth, db } from "./firebase";
