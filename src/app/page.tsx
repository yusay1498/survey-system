"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { NameInput } from "@/features/auth/components/NameInput";
import { saveUser } from "@/features/auth/api/saveUser";
import { signInAnonymously } from "@/features/auth/api/signInAnonymously";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // Redirect admin users to admin page
  if (user && !loading && !user.isAnonymous) {
    router.push("/admin");
    return <p className="p-6">管理者画面に移動中...</p>;
  }

  if (loading) return <p className="p-6">Loading...</p>;

  // If no user, show anonymous sign in option or admin login
  if (!user) {
    return (
      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">アンケートシステム</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">一般ユーザー</h2>
            <p className="text-sm mb-4 text-gray-600">
              アンケートに回答する場合はこちら
            </p>
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={async () => {
                await signInAnonymously();
              }}
            >
              アンケートに回答する
            </button>
          </div>

          <div>
            <AdminLoginForm />
          </div>
        </div>
      </main>
    );
  }

  // Anonymous user flow - require display name, then show survey
  if (!userName) {
    return (
      <main className="p-6">
        <NameInput
          onSubmit={async (name) => {
            await saveUser({
              uid: user.uid,
              displayName: name,
              createdAt: new Date(),
            });
            setUserName(name);
          }}
        />
      </main>
    );
  }

  return (
    <main className="p-6">
      <SurveyForm userId={user.uid} userName={userName} />
    </main>
  );
}
