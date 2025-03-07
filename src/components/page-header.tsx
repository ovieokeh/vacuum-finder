import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Breadcrumbs from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  containerClassName?: string;
  className?: string;
  children?: ReactNode;
  showBreadcrumbs?: boolean;
}
export const PageHeader = ({
  title,
  subtitle,
  showBreadcrumbs,
  containerClassName = "",
  className = "",
  children,
}: PageHeaderProps) => {
  return (
    <header className={twMerge("w-full bg-background border-b border-border", containerClassName)}>
      <div className={twMerge("mx-auto max-w-[1200px] px-4 py-10 flex flex-col gap-2", className)}>
        {showBreadcrumbs && <Breadcrumbs />}
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-sm md:text-base text-text/90">{subtitle}</p>
        {children}
      </div>
    </header>
  );
};
