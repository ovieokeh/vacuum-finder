import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, TableOptions } from "@tanstack/react-table";

import { CurrencySymbolMapping, Vacuum, VacuumsFilter } from "../types";
import { TableContainer } from "./table";
import { VacuumInfo } from "./vacuum-info";
import { VacuumFeatures } from "./vacuum-features";
import { getCheapestPrice } from "../shared-utils/price";
import { MdInfoOutline } from "react-icons/md";
import { Popover } from "./popover";
import { useSiteConfig } from "../providers/site-config";

interface VacuumResultsProps {
  filters?: VacuumsFilter;
  navigateRoot?: string;
  emptyView?: React.ReactNode;
  results?: Vacuum[];
}

const relativeWidth = (width: number, percent: number) => {
  return Math.floor((width * percent) / 100);
};

export function VacuumResults({
  results = [],
  filters,
  navigateRoot = "/vacuum-search",
  emptyView = (
    <div className="flex justify-center items-center h-64">
      <p>No results found. Adjust filters and try again.</p>
    </div>
  ),
  containerWidth,
}: VacuumResultsProps & {
  containerWidth: number;
}) {
  const siteConfig = useSiteConfig();
  const navigate = useNavigate();

  const currency = filters?.currency ?? siteConfig.currency;

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
            const cheapestPrice = getCheapestPrice(value.row.original, currency);
            return cheapestPrice === 0 ? (
              <span className="block w-full">n/a</span>
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
              <p className="block w-full">{`${CurrencySymbolMapping[currency]}${cheapestPrice}`}</p>
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
    [results, currency, containerWidth]
  );

  return (
    <>
      {!results || results?.length === 0 ? (
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
    <ul className="space-y-4">
      {results?.map((vacuum) => (
        <li key={vacuum.id} className="flex flex-col gap-4 p-4 border border-border rounded-lg shadow">
          <Link to={`${navigateRoot}/${vacuum.id}`}>
            <VacuumInfo vacuum={vacuum} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
