"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginSelection } from "@/features/auth/components/LoginSelection";
import { UserSurveyFlow } from "@/features/auth/components/UserSurveyFlow";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect admin users to admin page
  if (user && !loading && !user.isAnonymous) {
    router.push("/admin");
    return <p className="p-6">管理者画面に移動中...</p>;
  }

  if (loading) return <p className="p-6">Loading...</p>;

  // If no user, show login selection
  if (!user) {
    return <LoginSelection />;
  }

  // Anonymous user flow - show survey
  return <UserSurveyFlow userId={user.uid} />;
}
