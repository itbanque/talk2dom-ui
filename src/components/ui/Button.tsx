import React from "react";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer";

  const variantClasses =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600";

  const fullWidthClass = fullWidth ? "w-full" : "";

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${fullWidthClass} ${className || ""}`}
    >
      {children}
    </button>
  );
}