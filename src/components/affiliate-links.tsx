import React, { useMemo, useState } from "react";
import { getCoreRowModel, ColumnDef } from "@tanstack/react-table";

import { TableContainer } from "./table";
import { FormSelectField } from "./form-components";
import { AffiliateLink, AffiliateLinks, Currency, Region } from "../database";

interface AffiliateLinksTableProps {
  vacuumName: string;
  links?: AffiliateLinks;
}

export const AffiliateLinksTable: React.FC<AffiliateLinksTableProps> = ({ vacuumName, links }) => {
  // Filter state (with "All" as the default for no filter)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>("americas");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>("usd");

  // Filter the links array based on the current filter selections.
  const filteredLinks = useMemo(() => {
    return (
      links?.filter((link) => {
        const matchRegion = !selectedRegion || link.region === selectedRegion;
        const matchCurrency = !selectedCurrency || link.currency === selectedCurrency;
        return matchRegion && matchCurrency;
      }) ?? []
    );
  }, [links, selectedRegion, selectedCurrency]);

  // Define table columns using TanStack react-table types.
  const columns = useMemo<ColumnDef<AffiliateLink>[]>(
    () => [
      {
        accessorKey: "region",
        header: "Region",
        maxSize: 100,
        cell: (info) => <p className="capitalize">{info.getValue<Region>()}</p>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
        maxSize: 100,
      },
      {
        accessorKey: "link",
        header: "Site",
        maxSize: 100,
        cell: (info) => {
          const link = info.getValue<string>();
          const site = link.split("/")[2];

          return <p>{site}</p>;
        },
      },
    ],
    []
  );

  // Build the tableOptions object following TanStack react-table's interface.
  const tableOptions = useMemo(
    () => ({
      data: filteredLinks ?? [],
      columns,
      getCoreRowModel: getCoreRowModel(),
    }),
    [filteredLinks, columns]
  );

  return (
    <div>
      <h2 className="text-lg font-semibold">Purchase Links</h2>

      <p className="text-text/90 mb-4">
        Below are purchase links for the {vacuumName}. Click on a row to open the link in a new tab.
      </p>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="grow">
          <FormSelectField
            label="Region"
            value={selectedRegion ?? "americas"}
            onChange={(e) => setSelectedRegion(e)}
            options={["americas", "europe", "asia", "africa", "australia"]}
          />
        </div>
        <div className="grow">
          <FormSelectField
            label="Currency"
            value={selectedCurrency ?? "usd"}
            onChange={(e) => setSelectedCurrency(e)}
            options={["usd", "eur"]}
            labelClassName="uppercase"
            optionClassName="uppercase"
          />
        </div>
      </div>
      {/* Render the table */}
      {!!links && links.length > 0 ? (
        <TableContainer
          tableOptions={tableOptions}
          handleRowClick={(link) => window.open(link.link, "_blank", "noopener,noreferrer")}
        />
      ) : (
        <div>
          No purchase links found. You might be able to search the internet for this model.
          <a href={`https://www.google.com/search?q=${vacuumName}`} target="_blank" rel="noopener noreferrer">
            Search Google
          </a>
        </div>
      )}
    </div>
  );
};
