import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * エンティティの基本型
 */
type BaseEntity = {
  id: string;
  createdAt?: Date;
};

/**
 * Firestore Timestampを Date に変換するヘルパー関数
 */
const convertTimestampToDate = (timestamp: unknown): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (timestamp && typeof (timestamp as { toDate?: () => Date }).toDate === "function") {
    return (timestamp as { toDate: () => Date }).toDate();
  }
  return new Date();
};

/**
 * Firestoreコレクションからドキュメントを作成
 */
export const createDocument = async <T extends BaseEntity>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Firestoreドキュメントを更新
 */
export const updateDocument = async <T extends BaseEntity>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, "id" | "createdAt">>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data as DocumentData);
};

/**
 * Firestoreドキュメントを削除
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

/**
 * Firestoreドキュメントを取得
 */
export const getDocument = async <T extends BaseEntity>(
  collectionName: string,
  id: string
): Promise<T | undefined> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return undefined;
  }

  const data = snapshot.data();
  const result: Record<string, unknown> = {
    id: snapshot.id,
    ...data,
  };

  // createdAt が存在する場合は Date に変換
  if (data.createdAt) {
    result.createdAt = convertTimestampToDate(data.createdAt);
  }

  return result as T;
};

/**
 * Firestoreコレクション全体を取得（orderByあり）
 */
export const getCollection = async <T extends BaseEntity>(
  collectionName: string,
  orderByField?: string,
  orderDirection: "asc" | "desc" = "asc"
): Promise<T[]> => {
  let q: Query<DocumentData> = collection(db, collectionName);

  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const result: Record<string, unknown> = {
      id: doc.id,
      ...data,
    };

    // createdAt が存在する場合は Date に変換
    if (data.createdAt) {
      result.createdAt = convertTimestampToDate(data.createdAt);
    }

    return result as T;
  });
};

/**
 * ドキュメントの存在確認
 */
export const documentExists = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
};
