import { VacuumInfo } from "./vacuum-info";
import { VacuumsWithAffiliateLinks } from "../database";
import { twMerge } from "tailwind-merge";

interface VacuumResultsProps {
  navigateRoot?: string;
  emptyView?: React.ReactNode;
  results?: VacuumsWithAffiliateLinks;
  isLoading?: boolean;
  linkClassname?: string;
  className?: string;
}

export function VacuumResults({
  isLoading,
  results = [],
  className = "",
  linkClassname = "",
  emptyView = (
    <div className="flex justify-center items-center h-64">
      <p>No results found. Adjust filters and try again.</p>
    </div>
  ),
}: VacuumResultsProps & {
  containerWidth: number;
}) {
  return (
    <>
      {!results || results?.length === 0 ? (
        isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          emptyView
        )
      ) : (
        <ul className={twMerge(className)}>
          {results?.map((vacuum) => (
            <VacuumInfo key={vacuum.id} vacuum={vacuum} className={linkClassname} />
          ))}
        </ul>
      )}
    </>
  );
}
