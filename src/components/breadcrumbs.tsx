import React from "react";
import { Link, useLocation } from "react-router";
import { twMerge } from "tailwind-merge";

interface BreadcrumbsProps {
  // Optionally pass in a custom label transform if needed
  transformLabel?: (segment: string) => string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  transformLabel = (segment: string) => {
    const split = segment.split("/");
    const last = split[split.length - 1];
    return last === "" ? "home" : last;
  },
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const currentPath = pathnames.join("/");
  const previousPaths = pathnames.slice(0, pathnames.length - 1).filter((segment) => segment !== "vacuum");
  const processedPathnames = [...previousPaths, currentPath];
  if (processedPathnames.length === 1) {
    if (processedPathnames[0] !== "") {
      processedPathnames.unshift("");
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex space-x-2 text-sm">
      {processedPathnames.map((segment) => {
        const index = processedPathnames.indexOf(segment);
        const isFirstChild = index === 0;
        const isLast = index === processedPathnames.length - 1;
        const label = transformLabel ? transformLabel(segment) : segment;
        const url = `/${segment}`;

        return (
          <span key={url} className="flex items-center space-x-2 capitalize">
            {!isFirstChild && <span>/</span>}

            <Link to={url} className={twMerge("text-text/60 hover:underline", isLast && "text-text font-semibold")}>
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
