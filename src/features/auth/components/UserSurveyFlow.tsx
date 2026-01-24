"use client";

import { NameInput } from "./NameInput";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { saveUser } from "../api/saveUser";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { LoadingScreen } from "@/components/ui";

type UserSurveyFlowProps = {
  userId: string;
};

export const UserSurveyFlow = ({ userId }: UserSurveyFlowProps) => {
  // useLocalStorageを使用してuserNameを永続化
  const [userName, setUserName, , isLoading] = useLocalStorage<string | null>(
    `user_name_${userId}`,
    null
  );

  // localStorageから読み込み中はローディング画面を表示
  if (isLoading) {
    return <LoadingScreen message="読み込み中..." />;
  }

  if (!userName) {
    return (
      <main className="p-6">
        <NameInput
          onSubmit={async (name) => {
            await saveUser({
              uid: userId,
              displayName: name,
              createdAt: new Date(), // Not used, kept for type compatibility
            });
            setUserName(name);
          }}
        />
      </main>
    );
  }

  return (
    <main className="p-6">
      <SurveyForm key={userId} userId={userId} userName={userName} />
    </main>
  );
};
