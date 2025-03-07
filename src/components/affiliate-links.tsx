import React, { useMemo, useState } from "react";
import { getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { AffiliateLinkBase, Currency, Region, WithId } from "../types";
import { TableContainer } from "./table";
import { FormSelectField } from "./form";

interface AffiliateLinksTableProps {
  vacuumName: string;
  links?: WithId<AffiliateLinkBase>[];
}

export const AffiliateLinksTable: React.FC<AffiliateLinksTableProps> = ({ vacuumName, links }) => {
  // Filter state (with "All" as the default for no filter)
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("All");

  // Filter the links array based on the current filter selections.
  const filteredLinks = useMemo(() => {
    return links?.filter((link) => {
      const matchRegion = selectedRegion === "All" || link.region === selectedRegion;
      const matchCurrency = selectedCurrency === "All" || link.currency === selectedCurrency;
      return matchRegion && matchCurrency;
    });
  }, [links, selectedRegion, selectedCurrency]);

  console.log("filteredLinks", filteredLinks);

  // Define table columns using TanStack react-table types.
  const columns = useMemo<ColumnDef<WithId<AffiliateLinkBase>>[]>(
    () => [
      {
        accessorKey: "region",
        header: "Region",
        maxSize: 100,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
        maxSize: 100,
      },
      {
        accessorKey: "site",
        header: "Site",
        maxSize: 100,
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
      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="grow">
          <FormSelectField
            label="Region"
            selectedOption={selectedRegion}
            onChange={(e) => setSelectedRegion(e)}
            options={["All", ...Object.values(Region)]}
          />
        </div>
        <div className="grow">
          <FormSelectField
            label="Currency"
            selectedOption={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e)}
            options={["All", ...Object.values(Currency)]}
          />
        </div>
      </div>
      {/* Render the table */}
      {!!links && links.length > 0 ? (
        <TableContainer
          tableOptions={tableOptions}
          handleRowClick={(link) => window.open(link.url, "_blank", "noopener,noreferrer")}
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
