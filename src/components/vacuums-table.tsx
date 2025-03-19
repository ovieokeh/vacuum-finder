import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, TableOptions } from "@tanstack/react-table";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { VacuumsFilters } from "../types";
import { TableContainer } from "./table";
import { VacuumInfo } from "./vacuum-info";
import { VacuumFeatures } from "./vacuum-features";
import { PriceDisplay } from "./price-display";
import { VacuumsWithAffiliateLinks, VacuumWithAffiliateLinks } from "../database";

interface VacuumResultsProps {
  filters?: VacuumsFilters;
  navigateRoot?: string;
  emptyView?: React.ReactNode;
  results?: VacuumsWithAffiliateLinks;
  isLoading?: boolean;
}

const relativeWidth = (width: number, percent: number) => {
  return Math.floor((width * percent) / 100);
};

export function VacuumsTable({
  isLoading,
  results = [],
  filters,
  navigateRoot = "/vacuums",
  emptyView = (
    <div className="flex justify-center items-center h-64">
      <DotLottieReact src="https://lottie.host/ab07f75c-a00f-4906-8141-445c3dfa7c3d/5oI4FBC5dK.lottie" loop autoplay />
      <p>No results found. You can check other regions/currency, or adjust filters and try again.</p>
    </div>
  ),
  containerWidth,
}: VacuumResultsProps & {
  containerWidth: number;
}) {
  const navigate = useNavigate();

  const tableOptions: TableOptions<VacuumWithAffiliateLinks> = useMemo(
    () => ({
      columns: [
        {
          header: "",
          accessorKey: "image",
          size: relativeWidth(containerWidth, 8),
          cell: (value) => (
            <img
              src={value.row.original.imageUrl}
              alt={value.row.original.brand + " " + value.row.original.model}
              className="w-full h-auto min-h-[87px] object-contain"
            />
          ),
          enableSorting: false,
        },
        {
          header: "Name",
          accessorKey: "name",
          size: relativeWidth(containerWidth, 28),
          cell: (value) => {
            const brand = value.row.original.brand;
            const model = value.row.original.model;
            return `${brand} ${model}`;
          },
          enableSorting: false,
        },
        {
          header: "Price",
          accessorKey: "price",
          maxSize: relativeWidth(containerWidth, 10),
          cell: (value) => <PriceDisplay vacuum={value.row.original} />,
          enableSorting: true,
        },
        {
          header: "Battery",
          accessorKey: "batteryLifeInMinutes",
          size: relativeWidth(containerWidth, 10),
          cell: (value) => {
            const batteryLife = value.getValue();
            if (!batteryLife) return "N/A";
            const batteryLifeHours = Math.floor(batteryLife / 60);
            return `${batteryLifeHours}h ${batteryLife % 60}m`;
          },
          enableSorting: true,
        },
        {
          header: "Suction",
          accessorKey: "suctionPowerInPascals",
          size: relativeWidth(containerWidth, 10),
          cell: (value) => {
            const suction = value.getValue();
            if (!suction) return "N/A";
            return `${value.getValue()} Pa`;
          },
          enableSorting: true,
        },
        {
          header: "Features",
          accessorKey: "features",
          size: relativeWidth(containerWidth, 30),
          cell: (value) => (
            <VacuumFeatures
              vacuum={value.row.original}
              exclude={["batteryLifeInMinutes", "suctionPowerInPascals", "noiseLevelInDecibels"]}
              limit={3}
            />
          ),
          enableSorting: false,
        },
      ],
      data: results,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    }),
    [results, containerWidth]
  );

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
        <>
          <div className="hidden md:block">
            <TableContainer<VacuumWithAffiliateLinks>
              tableOptions={tableOptions}
              handleRowClick={(vacuum) => navigate(`${navigateRoot}/${vacuum.id}`)}
            />
          </div>
          <div className="md:hidden">
            <VacuumMobileList results={results} filters={filters} navigateRoot={navigateRoot} />
          </div>
        </>
      )}
    </>
  );
}

const VacuumMobileList = ({ results, navigateRoot }: VacuumResultsProps) => {
  return (
    <ul className="space-y-4 py-2">
      {results?.map((vacuum) => (
        <VacuumInfo key={vacuum.id} vacuum={vacuum} navigateRoot={navigateRoot} />
      ))}
    </ul>
  );
};
