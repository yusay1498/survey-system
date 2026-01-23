"use client";

import { AdminLoginForm } from "./AdminLoginForm";
import { AnonymousLoginButton } from "./AnonymousLoginButton";

export const LoginSelection = () => {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">アンケートシステム</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnonymousLoginButton />
        <AdminLoginForm />
      </div>
    </main>
  );
};
