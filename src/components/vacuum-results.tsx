import { ReactNode, useMemo, useState } from "react";
import { Button } from "@headlessui/react";
import { CiCircleInfo } from "react-icons/ci";
import { FaBatteryHalf, FaDog, FaTrashAlt, FaMobileAlt } from "react-icons/fa";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { GiVacuumCleaner, GiWaterDrop } from "react-icons/gi";
import { MdSensors, MdLayers } from "react-icons/md";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import { CurrencySymbolMapping, Vacuum, VacuumsFilter } from "../types";
import { useSiteConfig } from "../providers/site-config";
import { Modal } from "./modal";
import { VacuumSpecExplanations } from "./vacuum-spec-explanations";
import { TableContainer } from "./table";

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
        {
          header: "",
          accessorKey: "moreInfo",
          size: relativeWidth(containerWidth, 6),
          cell: (value) => <MoreInfoModal className="" vacuum={value.row.original} filters={filters} />,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const desktopTable = useMemo(() => <TableContainer<Vacuum> table={table} />, [table, currency]);
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
        <VacuumResult key={vacuum.id} vacuum={vacuum} filters={filters} />
      ))}
    </ul>
  );
};

interface VacuumResultProps {
  vacuum: Vacuum;
  filters: VacuumsFilter;
}

const VacuumResult = ({ vacuum, filters }: VacuumResultProps) => {
  return (
    <li className="flex flex-col gap-4 p-4 border border-border rounded-lg shadow">
      {/* Info */}
      <VacuumInfo vacuum={vacuum} filters={filters} />

      <MoreInfoModal className="mt-4 ml-auto" vacuum={vacuum} filters={filters} />
    </li>
  );
};

const VacuumInfo = ({
  vacuum,
  filters,
  imageClassName = "",
}: VacuumResultProps & {
  imageClassName?: string;
}) => {
  const { currency } = useSiteConfig();
  const USD_TO_EUR = 0.85;

  const price = currency === "USD" ? vacuum.price : (vacuum.price * USD_TO_EUR).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Image */}
      <div className={twMerge(" h-36 flex-shrink-0 sm:mb-0 overflow-hidden rounded", imageClassName)}>
        <img className="object-cover w-full h-full" src={vacuum.image} alt={vacuum.name} />
      </div>
      {/* Main info */}
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold text-primary">{vacuum.name}</h3>
          <p className="text-sm text-gray-500">
            {vacuum.brand} – {vacuum.model}
          </p>
        </div>
        <p className="mt-2 sm:mt-0 text-lg font-bold text-accent">
          {CurrencySymbolMapping[currency]}
          {price}
        </p>

        {/* Feature icons */}
        <div>
          <p className="text-sm font-semibold">Features</p>
          <div className="p-1">
            <VacuumFeatures vacuum={vacuum} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

const VacuumFeatures = ({
  vacuum,
  exclude = [],
  limit,
}: VacuumResultProps & {
  exclude?: (keyof Vacuum)[];
  limit?: number;
}) => {
  const featureKeyMapping: Record<keyof Vacuum, { icon: ReactNode; text: string }> = {
    ["batteryLifeMins"]: { icon: <FaBatteryHalf />, text: `${vacuum.batteryLifeMins} min` },
    ["suctionPowerPa"]: { icon: <GiVacuumCleaner />, text: `${vacuum.suctionPowerPa} Pa` },
    ["noiseLevelDb"]: { icon: <BsFillVolumeUpFill />, text: `${vacuum.noiseLevelDb} dB` },
    ["mappingTechnology"]: { icon: <MdSensors />, text: vacuum.mappingTechnology },
    ["multiFloorMapping"]: { icon: <MdLayers />, text: "Multi-floor" },
    ["virtualWalls"]: { icon: <MdSensors />, text: "Virtual walls" },
    ["mopFunction"]: { icon: <GiWaterDrop />, text: "Mop" },
    ["selfEmptying"]: { icon: <FaTrashAlt />, text: "Self-empty" },
    ["appControl"]: { icon: <FaMobileAlt />, text: "App Control" },
    ["petHair"]: { icon: <FaDog />, text: "Pet-friendly" },
  };

  let keys = Object.keys(featureKeyMapping) as (keyof Vacuum)[];
  keys = keys.filter((key) => exclude.includes(key) === false);
  if (limit) {
    keys.splice(limit);
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {keys.map((key) => {
        if (featureKeyMapping[key as keyof Vacuum] && !exclude.includes(key as keyof Vacuum)) {
          const { icon, text } = featureKeyMapping[key as keyof Vacuum];
          return (
            <div key={key} className="flex items-center gap-1">
              {icon}
              <span>{text}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const MoreInfoModal = ({ className = "", vacuum, filters }: VacuumResultProps & { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <div className={className}>
      <Button
        onClick={open}
        className="bg-background! flex items-center md:p-0! gap-1 py-1! text-start outline-0! focus:outline-0!"
      >
        <CiCircleInfo className="inline w-5 h-5" />
      </Button>

      <Modal title={vacuum.name} isOpen={isOpen} close={close} panelClassName="min-w-[80%]">
        <div className="flex flex-col flex-grow gap-4">
          <VacuumInfo vacuum={vacuum} filters={filters} imageClassName="w-full h-64 sm:size-52 mx-auto grow" />

          <VacuumSpecExplanations vacuum={vacuum} filters={filters} />
          {/* Future expansions: affiliate links, user reviews, etc. */}
        </div>
      </Modal>
    </div>
  );
};
