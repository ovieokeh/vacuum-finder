import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  children?: ReactNode;
}
export const PageHeader = ({ title, subtitle, className = "", children }: PageHeaderProps) => {
  return (
    <header className="w-full bg-background-alt border-b border-border">
      <div className={twMerge("mx-auto max-w-7xl px-6 py-10 md:py-16 flex flex-col gap-2", className)}>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-sm md:text-base text-text/90">{subtitle}</p>
        {children}
      </div>
    </header>
  );
};
