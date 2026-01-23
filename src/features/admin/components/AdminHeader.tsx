"use client";

type Props = {
  email: string | null;
  uid: string;
  onLogout: () => void;
};

export const AdminHeader = ({ email, uid, onLogout }: Props) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">管理者画面</h1>
        <p className="text-sm text-gray-600">{email || uid}</p>
      </div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={onLogout}
      >
        ログアウト
      </button>
    </div>
  );
};
