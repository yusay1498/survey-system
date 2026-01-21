"use client";

import { useState } from "react";
import { signInWithEmail } from "../api/signInWithEmail";

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
    <div className="p-4 border rounded space-y-2">
      <h2 className="font-bold">管理者ログイン</h2>

      <input
        className="border px-2 py-1 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border px-2 py-1 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded w-full"
        onClick={handleLogin}
        disabled={loading}
      >
        ログイン
      </button>
    </div>
  );
};
