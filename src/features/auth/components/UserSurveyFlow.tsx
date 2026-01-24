"use client";

import { NameInput } from "./NameInput";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { saveUser } from "../api/saveUser";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";

type Props = {
  userId: string;
};

export const UserSurveyFlow = ({ userId }: Props) => {
  // useLocalStorageを使用してuserNameを永続化
  const [userName, setUserName] = useLocalStorage<string | null>(
    `user_name_${userId}`,
    null
  );

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
      <SurveyForm userId={userId} userName={userName} />
    </main>
  );
};
