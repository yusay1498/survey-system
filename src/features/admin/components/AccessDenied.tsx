"use client";

type Props = {
  onBackToHome: () => void;
};

export const AccessDenied = ({ onBackToHome }: Props) => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="border rounded p-6 bg-red-50">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          アクセス権限がありません
        </h2>
        <p className="text-red-600 mb-4">
          管理者としてログインする必要があります。
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onBackToHome}
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};
