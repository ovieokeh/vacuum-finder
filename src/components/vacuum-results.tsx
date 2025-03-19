import { VacuumInfo } from "./vacuum-info";
import { twMerge } from "tailwind-merge";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { VacuumsWithAffiliateLinks } from "../database";

interface VacuumResultsProps {
  results?: VacuumsWithAffiliateLinks;
  isLoading?: boolean;
  linkClassname?: string;
  className?: string;
  emptyView?: React.ReactNode;
  fetchMoreComponent?: React.ReactNode;
}

export function VacuumResults({
  isLoading,
  results = [],
  className = "",
  linkClassname = "",
  emptyView = (
    <div className="flex flex-col justify-center items-center">
      <div className="size-64 mb-4">
        <DotLottieReact
          src="https://lottie.host/ab07f75c-a00f-4906-8141-445c3dfa7c3d/5oI4FBC5dK.lottie"
          loop
          autoplay
        />
      </div>
      <p>No results found. You can check other regions/currency, or adjust filters and try again.</p>
    </div>
  ),
  fetchMoreComponent,
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

          {fetchMoreComponent}
        </ul>
      )}
    </>
  );
}
