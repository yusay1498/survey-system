"use client";

type UnauthorizedAccessProps =
  | {
      type: "not-logged-in";
      onAction: () => void;
    }
  | {
      type: "insufficient-permissions";
      uid: string;
      onAction: () => void;
    };

export const UnauthorizedAccess = ({ type, onAction, ...props }: UnauthorizedAccessProps) => {
  const isNotLoggedIn = type === "not-logged-in";
  const uid = "uid" in props ? props.uid : undefined;
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className={`border rounded p-6 ${isNotLoggedIn ? "bg-red-50" : "bg-yellow-50"}`}>
        <h2 className={`text-xl font-bold mb-2 ${isNotLoggedIn ? "text-red-800" : "text-yellow-800"}`}>
          {isNotLoggedIn ? "アクセス権限がありません" : "管理者権限がありません"}
        </h2>
        <p className={`mb-4 ${isNotLoggedIn ? "text-red-600" : "text-yellow-700"}`}>
          {isNotLoggedIn ? (
            "管理者としてログインする必要があります。"
          ) : (
            <>
              このアカウントには管理者権限が付与されていません。
              <br />
              UID: {uid}
            </>
          )}
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onAction}
        >
          {isNotLoggedIn ? "ホームに戻る" : "ログアウト"}
        </button>
      </div>
    </div>
  );
};
