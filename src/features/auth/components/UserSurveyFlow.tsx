"use client";

import { useState } from "react";
import { NameInput } from "./NameInput";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { saveUser } from "../api/saveUser";

type Props = {
  userId: string;
};

export const UserSurveyFlow = ({ userId }: Props) => {
  const [userName, setUserName] = useState<string | null>(null);

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
