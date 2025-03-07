import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, TableOptions } from "@tanstack/react-table";

import { Vacuum, VacuumsFilter } from "../types";
import { TableContainer } from "./table";
import { VacuumInfo } from "./vacuum-info";
import { VacuumFeatures } from "./vacuum-features";
import { PriceDisplay } from "./price-display";

interface VacuumResultsProps {
  filters?: VacuumsFilter;
  navigateRoot?: string;
  emptyView?: React.ReactNode;
  results?: {
    data: Vacuum[];
  };
}

const relativeWidth = (width: number, percent: number) => {
  return Math.floor((width * percent) / 100);
};

export function VacuumResults({
  results = { data: [] },
  filters,
  navigateRoot = "/vacuums",
  emptyView = (
    <div className="flex justify-center items-center h-64">
      <p>No results found. Adjust filters and try again.</p>
    </div>
  ),
  containerWidth,
}: VacuumResultsProps & {
  containerWidth: number;
}) {
  const navigate = useNavigate();

  const tableOptions: TableOptions<Vacuum> = useMemo(
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
              className="w-16 h-16 object-contain"
            />
          ),
          enableSorting: false,
        },
        {
          header: "Name",
          accessorKey: "name",
          size: relativeWidth(containerWidth, 20),
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
          maxSize: relativeWidth(containerWidth, 12),
          cell: (value) => <PriceDisplay vacuum={value.row.original} />,
          enableSorting: true,
        },
        {
          header: "Battery",
          accessorKey: "batteryLifeInMinutes",
          size: relativeWidth(containerWidth, 10),
          cell: (value) => {
            const batteryLife = value.getValue();
            const batteryLifeHours = Math.floor(batteryLife / 60);
            return `${batteryLifeHours}h ${batteryLife % 60}m`;
          },
          enableSorting: true,
        },
        {
          header: "Suction",
          accessorKey: "suctionPowerInPascals",
          size: relativeWidth(containerWidth, 12),
          cell: (value) => {
            return `${value.getValue()} Pa`;
          },
          enableSorting: true,
        },
        {
          header: "Noise",
          accessorKey: "noiseLevelInDecibels",
          size: relativeWidth(containerWidth, 12),
          cell: (value) => `${value.getValue()} dB`,
          enableSorting: true,
        },
        {
          header: "Features",
          accessorKey: "features",
          size: relativeWidth(containerWidth, 20),
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
      data: results?.data,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    }),
    [results, containerWidth]
  );

  return (
    <>
      {!results || results?.data?.length === 0 ? (
        emptyView
      ) : (
        <>
          <div className="hidden md:block">
            <TableContainer<Vacuum>
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
      {results?.data?.map((vacuum) => (
        <li key={vacuum.id} className="flex flex-col gap-4 p-4 border border-border rounded-lg">
          <Link to={`${navigateRoot}/${vacuum.id}`}>
            <VacuumInfo vacuum={vacuum} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
