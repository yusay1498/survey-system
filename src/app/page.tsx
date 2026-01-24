"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginSelection } from "@/features/auth/components/LoginSelection";
import { UserSurveyFlow } from "@/features/auth/components/UserSurveyFlow";
import { LoadingScreen } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect admin users to admin page
  if (user && !loading && !user.isAnonymous) {
    router.push("/admin");
    return <LoadingScreen message="管理者画面に移動中..." />;
  }

  if (loading) return <LoadingScreen />;

  // If no user, show login selection
  if (!user) {
    return <LoginSelection />;
  }

  // Anonymous user flow - show survey
  return <UserSurveyFlow userId={user.uid} />;
}
