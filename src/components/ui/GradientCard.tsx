import React from "react";

type GradientCardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "gradient-blue" | "gradient-purple" | "gradient-green" | "default";
};

const variantClasses = {
  "gradient-blue": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md",
  "gradient-purple": "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md",
  "gradient-green": "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md",
  "default": "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 border-2 border-blue-200 dark:border-blue-700 shadow-lg",
};

/**
 * グラデーション背景を持つカードコンポーネント
 */
export const GradientCard = ({ 
  children, 
  className = "", 
  variant = "default" 
}: GradientCardProps) => {
  return (
    <div className={`${variantClasses[variant]} rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
