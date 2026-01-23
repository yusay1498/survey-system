"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdmin } from "@/features/admin/api/isAdmin";
import { QuestionManager } from "@/features/admin/components/QuestionManager";
import { ResultList } from "@/features/survey/components/ResultList";
import { getQuestions } from "@/features/survey/api/getQuestions";
import { Question } from "@/entities/question";
import { firebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checking, setChecking] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isAdmin(user.uid);
        setIsAdminUser(adminStatus);
      }
      setChecking(false);
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!questionsLoaded) {
      getQuestions().then((q) => {
        setQuestions(q);
        setQuestionsLoaded(true);
      });
    }
  }, [questionsLoaded]);

  const loadQuestions = async () => {
    const q = await getQuestions();
    setQuestions(q);
  };

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    window.location.href = "/";
  };

  if (loading || checking) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="border rounded p-6 bg-red-50">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            アクセス権限がありません
          </h2>
          <p className="text-red-600 mb-4">
            管理者としてログインする必要があります。
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => (window.location.href = "/")}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="border rounded p-6 bg-yellow-50">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            管理者権限がありません
          </h2>
          <p className="text-yellow-700 mb-4">
            このアカウントには管理者権限が付与されていません。
            <br />
            UID: {user.uid}
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">管理者画面</h1>
          <p className="text-sm text-gray-600">
            {user.email || user.uid}
          </p>
        </div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>

      <div className="space-y-8">
        <QuestionManager questions={questions} onUpdate={loadQuestions} />

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">回答結果</h2>
          <ResultList questions={questions} />
        </div>
      </div>
    </main>
  );
}
