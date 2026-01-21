"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { NameInput } from "@/features/auth/components/NameInput";
import { saveUser } from "@/features/auth/api/saveUser";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return null;

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
