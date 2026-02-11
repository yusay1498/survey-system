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
    let cancelled = false;

    const checkAdmin = async () => {
      if (user && !user.isAnonymous) {
        try {
          const adminStatus = await isAdmin(user.uid);
          if (cancelled) return;
          setIsAdminUser(adminStatus);
        } catch (error) {
          if (cancelled) return;
          console.error("管理者権限の確認に失敗しました:", error);
          setIsAdminUser(false);
        } finally {
          if (cancelled) return;
          setChecking(false);
        }
      } else {
        // 匿名ユーザーまたはユーザーなしの場合は即座に判定
        if (cancelled) return;
        setIsAdminUser(false);
        setChecking(false);
      }
    };

    if (!loading) {
      setChecking(true);
      checkAdmin();
    }

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  return { user, loading, isAdminUser, checking };
};
