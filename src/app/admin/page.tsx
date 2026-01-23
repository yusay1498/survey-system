"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdmin } from "@/features/admin/api/isAdmin";
import { AccessDenied } from "@/features/admin/components/AccessDenied";
import { InsufficientPermissions } from "@/features/admin/components/InsufficientPermissions";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { signOut } from "@/features/auth/api/signOut";
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
    window.location.href = "/";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  if (loading || checking) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user || user.isAnonymous) {
    return <AccessDenied onBackToHome={handleBackToHome} />;
  }

  if (!isAdminUser) {
    return <InsufficientPermissions uid={user.uid} onLogout={handleLogout} />;
  }

  return (
    <AdminDashboard
      userEmail={user.email}
      userId={user.uid}
      onLogout={handleLogout}
    />
  );
}
