import React from "react";

export interface ButtonProps {
  varient: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick: () => void;
  disable?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  varient,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  disable = false
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg transition disabled:opacity-50 cursor-pointer";

  const variantStyles = {
    primary: " bg-neutral-50 hover:bg-neutral-200 hover:scale-105 text-neutral-900 transition-all",
    secondary: "bg-neutral-950  hover:bg-neutral-800 hover:scale-105 text-white transition-all",
    danger: "bg-red-600 hover:bg-red-700 hover:scale-105 text-white transition-all",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-3 text-md",
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disable}
      className={`${baseStyles} ${variantStyles[varient]} ${sizeStyles[size]}`}
    >
      {startIcon && <span>{startIcon}</span>}
      <span>{text}</span>
      {endIcon && <span>{endIcon}</span>}

    </button>
  )
}


