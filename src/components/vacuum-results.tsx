import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import { CurrencySymbolMapping, Vacuum, VacuumsFilter } from "../types";
import { TableContainer } from "./table";
import { VacuumInfo } from "./vacuum-info";
import { VacuumFeatures } from "./vacuum-features";
import { getCheapestPrice } from "../shared-utils/price";
import { MdInfoOutline } from "react-icons/md";
import { Popover } from "./popover";

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

  const tableOptions: TableOptions<Vacuum> = useMemo(
    () => ({
      columns: [
        {
          header: "Name",
          accessorKey: "name",
          size: relativeWidth(containerWidth, 25),
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
          size: relativeWidth(containerWidth, 11),
          cell: (value) => {
            const cheapestPrice = getCheapestPrice(value.row.original, filters.currency);
            return cheapestPrice === 0 ? (
              <span className="text-center block w-full">n/a</span>
            ) : cheapestPrice === -1 ? (
              <Popover
                className="grow flex justify-center"
                panelClassName="bg-background p-4 border border-border"
                trigger={<MdInfoOutline className="w-4 h-4 text-text!" />}
              >
                <p className="text-text/90">No price available in your chosen currency.</p>
                <p className="text-text/90">Try changing your selected currency at the top of the page.</p>
              </Popover>
            ) : (
              `${CurrencySymbolMapping[filters.currency]}${cheapestPrice}`
            );
          },
          enableSorting: true,
        },
        {
          header: "Battery",
          accessorKey: "batteryLifeInMinutes",
          size: relativeWidth(containerWidth, 12),
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
          size: relativeWidth(containerWidth, 11),
          cell: (value) => `${value.getValue()} dB`,
          enableSorting: true,
        },
        {
          header: "Features",
          accessorKey: "features",
          size: relativeWidth(containerWidth, 23),
          cell: (value) => (
            <VacuumFeatures
              filters={filters}
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
    [results, filters, containerWidth]
  );

  const table = useReactTable(tableOptions);

  return (
    <>
      {results.length === 0 ? (
        <p>No results found. Adjust filters and try again.</p>
      ) : (
        <>
          <div className="hidden md:block">
            <TableContainer<Vacuum>
              table={table}
              handleRowClick={(vacuum) => navigate(`/vacuum-search/${vacuum.id}`)}
            />
          </div>
          <div className="md:hidden">
            <VacuumMobileList results={results} filters={filters} />
          </div>
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
          <Link to={`/vacuum-search/${vacuum.id}`}>
            <VacuumInfo vacuum={vacuum} filters={filters} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
