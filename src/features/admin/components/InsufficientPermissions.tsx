"use client";

type Props = {
  uid: string;
  onLogout: () => void;
};

export const InsufficientPermissions = ({ uid, onLogout }: Props) => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="border rounded p-6 bg-yellow-50">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">
          管理者権限がありません
        </h2>
        <p className="text-yellow-700 mb-4">
          このアカウントには管理者権限が付与されていません。
          <br />
          UID: {uid}
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onLogout}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};
