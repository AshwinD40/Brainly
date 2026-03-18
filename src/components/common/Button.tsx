import React from "react";

interface ButtonProps {
  varient: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick: () => void;
  disable?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  varient,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  disable = false,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl border font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55";

  const variantStyles = {
    primary:
      "border-white/18 bg-[linear-gradient(180deg,rgba(245,245,245,0.96),rgba(214,214,214,0.9))] text-neutral-950 shadow-[0_18px_40px_-24px_rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
    secondary:
      "border-white/12 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_42px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] active:translate-y-0",
    danger:
      "border-red-400/24 bg-[linear-gradient(180deg,rgba(220,38,38,0.88),rgba(153,27,27,0.92))] text-white shadow-[0_18px_40px_-24px_rgba(220,38,38,0.75)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0",
  };

  const sizeStyles = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-11 px-4.5 text-sm",
    lg: "h-12 px-5 text-[0.95rem]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disable}
      className={`${baseStyles} ${variantStyles[varient]} ${sizeStyles[size]} ${className}`}
    >
      {startIcon && <span className="shrink-0 text-[1.05em]">{startIcon}</span>}
      <span>{text}</span>
      {endIcon && <span className="shrink-0 text-[1.05em]">{endIcon}</span>}
    </button>
  );
};
