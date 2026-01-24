import { Spinner } from "./Spinner";

type LoadingScreenProps = {
  message?: string;
};

/**
 * Full page loading screen with centered spinner
 * Uses Pines animation patterns for smooth loading experience
 */
export const LoadingScreen = ({ message = "読み込み中..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <Spinner size="lg" label={message} />
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
