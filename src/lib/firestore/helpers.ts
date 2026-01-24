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
 * Firestoreコレクションからドキュメントを作成
 */
export const createDocument = async <T extends DocumentData>(
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
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, "id" | "createdAt">>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
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
export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T;
};

/**
 * Firestoreコレクション全体を取得（orderByあり）
 */
export const getCollection = async <T>(
  collectionName: string,
  orderByField?: string,
  orderDirection: "asc" | "desc" = "asc"
): Promise<T[]> => {
  let q: Query<DocumentData> = collection(db, collectionName);

  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
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
