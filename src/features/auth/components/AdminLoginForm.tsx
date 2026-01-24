"use client";

import { useState } from "react";
import { signInWithEmail } from "../api/signInWithEmail";
import { Spinner } from "@/components/ui";

export const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch {
      alert("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-2 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="font-bold">管理者ログイン</h2>

      <input
        className="border px-2 py-1 w-full dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border px-2 py-1 w-full dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded w-full dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center gap-2"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading && <Spinner size="sm" label="ログイン中..." />}
        ログイン
      </button>
    </div>
  );
};
