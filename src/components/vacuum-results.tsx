import { Link } from "react-router";

import { VacuumsFilters } from "../types";
import { VacuumInfo } from "./vacuum-info";
import { VacuumsWithAffiliateLinks } from "../database";

interface VacuumResultsProps {
  filters?: VacuumsFilters;
  navigateRoot?: string;
  emptyView?: React.ReactNode;
  results?: VacuumsWithAffiliateLinks;
  isLoading?: boolean;
}

export function VacuumResults({
  isLoading,
  results = [],
  filters,
  navigateRoot = "/vacuums",
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
        <div className="">
          <VacuumMobileList results={results} filters={filters} navigateRoot={navigateRoot} />
        </div>
      )}
    </>
  );
}

const VacuumMobileList = ({ results, navigateRoot }: VacuumResultsProps) => {
  return (
    <ul className="space-y-4 py-2">
      {results?.map((vacuum) => (
        <li key={vacuum.id} className="flex flex-col gap-4 p-4 border border-border rounded-lg">
          <Link to={`${navigateRoot}/${vacuum.id}`}>
            <VacuumInfo vacuum={vacuum} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
