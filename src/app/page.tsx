"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { NameInput } from "@/features/auth/components/NameInput";
import { saveUser } from "@/features/auth/api/saveUser";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (name: string) => {
    await saveUser({
      uid: user.uid,
      displayName: name,
      createdAt: new Date(),
    });
  };

  return (
    <main className="p-6">
      <NameInput onSubmit={handleSubmit} />
    </main>
  );
}
