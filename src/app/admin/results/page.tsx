"use client";

import { useAdminAccess } from "@/features/admin/hooks/useAdminAccess";
import { UnauthorizedAccess } from "@/features/admin/components/UnauthorizedAccess";
import { ResultScreen } from "@/features/admin/components/ResultScreen";
import { signOut } from "@/features/auth/api/signOut";
import { LoadingScreen } from "@/components/ui";
import { BASE_PATH } from "@/lib/constants";

export default function ResultPage() {
  const { user, loading, isAdminUser, checking } = useAdminAccess();

  const handleLogout = async () => {
    await signOut();
    window.location.href = BASE_PATH + "/";
  };

  const handleBackToHome = () => {
    window.location.href = BASE_PATH + "/";
  };

  if (loading || checking) {
    return <LoadingScreen />;
  }

  if (!user || user.isAnonymous) {
    return <UnauthorizedAccess type="not-logged-in" onAction={handleBackToHome} />;
  }

  if (!isAdminUser) {
    return <UnauthorizedAccess type="insufficient-permissions" uid={user.uid} onAction={handleLogout} />;
  }

  return (
    <ResultScreen
      userEmail={user.email}
      userId={user.uid}
      onLogout={handleLogout}
    />
  );
}
