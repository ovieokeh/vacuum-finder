import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import { CurrencySymbolMapping, Vacuum, VacuumsFilter } from "../types";
import { useSiteConfig } from "../providers/site-config";
import { TableContainer } from "./table";
import { VacuumInfo } from "./vacuum-info";
import { VacuumFeatures } from "./vacuum-features";

interface VacuumResultsProps {
  filters: VacuumsFilter;
  results: Vacuum[];
}

const relativeWidth = (width: number, percent: number) => {
  return Math.floor((width * percent) / 100);
};

export function VacuumResults({
  results,
  filters,
  containerWidth,
}: VacuumResultsProps & {
  containerWidth: number;
}) {
  const navigate = useNavigate();
  const { currency } = useSiteConfig();
  const USD_TO_EUR = 0.85;

  const options: TableOptions<Vacuum> = useMemo(
    () => ({
      columns: [
        { header: "Name", accessorKey: "name", size: relativeWidth(containerWidth, 30) },
        {
          header: "Price",
          accessorKey: "price",
          size: relativeWidth(containerWidth, 11),
          enableSorting: true,
          cell: (value) => {
            const priceValue = value.getValue();
            const price = currency === "USD" ? priceValue : (priceValue * USD_TO_EUR).toFixed(2);
            return `${CurrencySymbolMapping[currency]}${price}`;
          },
        },
        {
          header: "Battery",
          accessorKey: "batteryLifeMins",
          size: relativeWidth(containerWidth, 9),
          cell: (value) => {
            const batteryLife = value.getValue();
            const batteryLifeHours = Math.floor(batteryLife / 60);
            return `${batteryLifeHours}h ${batteryLife % 60}m`;
          },
        },
        {
          header: "Suction",
          accessorKey: "suctionPowerPa",
          size: relativeWidth(containerWidth, 10),
          cell: (value) => {
            return `${value.getValue()} Pa`;
          },
        },
        {
          header: "Noise",
          accessorKey: "noiseLevelDb",
          size: relativeWidth(containerWidth, 8),
          cell: (value) => `${value.getValue()} dB`,
        },
        {
          header: "Features",
          accessorKey: "features",
          size: relativeWidth(containerWidth, 26),
          cell: (value) => (
            <VacuumFeatures
              filters={filters}
              vacuum={value.row.original}
              exclude={["batteryLifeMins", "suctionPowerPa", "noiseLevelDb"]}
              limit={3}
            />
          ),
        },
      ],
      data: results,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    }),
    [results, filters, currency, containerWidth]
  );

  const table = useReactTable(options);

  const desktopTable = useMemo(
    () => <TableContainer<Vacuum> table={table} handleRowClick={(vacuum) => navigate(`/vacuum-search/${vacuum.id}`)} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, currency, navigate]
  );
  const mobileList = useMemo(() => <VacuumMobileList results={results} filters={filters} />, [results, filters]);

  return (
    <>
      {results.length === 0 ? (
        <p>No results found. Adjust filters and try again.</p>
      ) : (
        <>
          <div className="hidden md:block">{desktopTable}</div>
          <div className="md:hidden">{mobileList}</div>
        </>
      )}
    </>
  );
}

const VacuumMobileList = ({ results, filters }: VacuumResultsProps) => {
  return (
    <ul className="space-y-4">
      {results.map((vacuum) => (
        <li key={vacuum.id} className="flex flex-col gap-4 p-4 border border-border rounded-lg shadow">
          {/* Info */}
          <VacuumInfo vacuum={vacuum} filters={filters} />
        </li>
      ))}
    </ul>
  );
};
