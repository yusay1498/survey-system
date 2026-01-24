"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdmin } from "@/features/admin/api/isAdmin";
import { UnauthorizedAccess } from "@/features/admin/components/UnauthorizedAccess";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { signOut } from "@/features/auth/api/signOut";
import { LoadingScreen } from "@/components/ui";
import { BASE_PATH } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checking, setChecking] = useState(true);

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
    <AdminDashboard
      userEmail={user.email}
      userId={user.uid}
      onLogout={handleLogout}
    />
  );
}
