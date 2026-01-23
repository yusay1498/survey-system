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

export const UnauthorizedAccess = (props: UnauthorizedAccessProps) => {
  const isNotLoggedIn = props.type === "not-logged-in";
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className={`border rounded p-6 ${isNotLoggedIn ? "bg-red-50 dark:bg-red-900" : "bg-yellow-50 dark:bg-yellow-900"}`}>
        <h2 className={`text-xl font-bold mb-2 ${isNotLoggedIn ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}>
          {isNotLoggedIn ? "アクセス権限がありません" : "管理者権限がありません"}
        </h2>
        <p className={`mb-4 ${isNotLoggedIn ? "text-red-600 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"}`}>
          {isNotLoggedIn ? (
            "管理者としてログインする必要があります。"
          ) : (
            <>
              このアカウントには管理者権限が付与されていません。
              <br />
              UID: {props.uid}
            </>
          )}
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={props.onAction}
        >
          {isNotLoggedIn ? "ホームに戻る" : "ログアウト"}
        </button>
      </div>
    </div>
  );
};
