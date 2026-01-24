/**
 * Spinner component with animation from Pines (https://devdojo.com/pines)
 * Provides accessible loading indication with aria-label support
 */

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export const Spinner = ({ 
  size = "md", 
  label = "読み込み中...",
  className = "" 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
    >
      <div
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-600 dark:border-t-blue-400`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
