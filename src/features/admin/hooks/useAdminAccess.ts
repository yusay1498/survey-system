"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdmin } from "@/features/admin/api/isAdmin";

export type AdminAccessState = {
  user: ReturnType<typeof useAuth>["user"];
  loading: boolean;
  isAdminUser: boolean;
  checking: boolean;
};

/**
 * 管理者アクセス権限をチェックする共通フック
 * 認証状態と管理者権限を確認し、エラーハンドリングを含む
 */
export const useAdminAccess = (): AdminAccessState => {
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        try {
          const adminStatus = await isAdmin(user.uid);
          setIsAdminUser(adminStatus);
        } catch (error) {
          console.error("管理者権限の確認に失敗しました:", error);
          setIsAdminUser(false);
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading]);

  return { user, loading, isAdminUser, checking };
};
