import React from "react";
import { flexRender, Table, Row, Cell, Header, HeaderGroup, useReactTable, TableOptions } from "@tanstack/react-table";
import { VirtualItem, Virtualizer, useVirtualizer } from "@tanstack/react-virtual";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

import { useIsClient } from "../hooks/use-is-client";
import { twMerge } from "tailwind-merge";

interface TableContainerProps<T> {
  tableOptions: TableOptions<T>;
  handleRowClick: (row: T) => void;
}

export function TableContainer<T extends Record<string, any>>({
  tableOptions,
  handleRowClick,
}: TableContainerProps<T>) {
  const table = useReactTable(tableOptions);
  const visibleColumns = table.getVisibleLeafColumns();
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Virtualize columns
  const columnVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableCellElement>({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div
      ref={tableContainerRef}
      className="
        relative
        overflow-auto
        mx-auto
        border
        border-border
        rounded
      "
    >
      <table className="grid w-full text-sm">
        <TableHead
          columnVirtualizer={columnVirtualizer}
          table={table}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
        <TableBody
          columnVirtualizer={columnVirtualizer}
          table={table}
          tableContainerRef={tableContainerRef}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
          handleRowClick={handleRowClick}
        />
      </table>
    </div>
  );
}

/* ------------------ Table Head ------------------ */

interface TableHeadProps<T> {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  table: Table<T>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
}

function TableHead<T extends Record<string, unknown>>({
  columnVirtualizer,
  table,
  virtualPaddingLeft,
  virtualPaddingRight,
}: TableHeadProps<T>) {
  return (
    <thead className="grid sticky top-0 z-10 bg-gray-50 dark:bg-background">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeadRow
          key={headerGroup.id}
          headerGroup={headerGroup}
          columnVirtualizer={columnVirtualizer}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
      ))}
    </thead>
  );
}

interface TableHeadRowProps<T> {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  headerGroup: HeaderGroup<T>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
}

function TableHeadRow<T extends Record<string, unknown>>({
  columnVirtualizer,
  headerGroup,
  virtualPaddingLeft,
  virtualPaddingRight,
}: TableHeadRowProps<T>) {
  const virtualColumns = columnVirtualizer.getVirtualItems();

  return (
    <tr className="grow flex w-full border-b border-border">
      {virtualPaddingLeft ? <th className="flex" style={{ width: virtualPaddingLeft }} /> : null}

      {virtualColumns.map((virtualColumn) => {
        const header = headerGroup.headers[virtualColumn.index];
        return <TableHeadCell key={header.id} header={header} />;
      })}

      {virtualPaddingRight ? <th className="flex" style={{ width: virtualPaddingRight }} /> : null}
    </tr>
  );
}

interface TableHeadCellProps<T> {
  header: Header<T, unknown>;
}

function TableHeadCell<T extends Record<string, unknown>>({ header }: TableHeadCellProps<T>) {
  const canSort = header.column.getCanSort();
  const sortHandler = header.column.getToggleSortingHandler();
  const isSorted = header.column.getIsSorted() as string;
  const sortIndicator = canSort
    ? {
        asc: <FaSortUp className="opacity-50 inline size-3" />,
        desc: <FaSortDown className="opacity-50 inline size-3" />,
      }[isSorted] ?? <FaSort className="opacity-50 inline size-3" />
    : null;

  return (
    <th
      key={header.id}
      className="grow flex items-center border-r border-border last:border-none"
      style={{ width: header.getSize() }}
    >
      <div
        onClick={canSort ? sortHandler : undefined}
        className={twMerge("px-3 py-2", canSort ? "flex items-center gap-2 cursor-pointer select-none" : "")}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {sortIndicator}
      </div>
    </th>
  );
}

/* ------------------ Table Body ------------------ */

interface TableBodyProps<T> {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  table: Table<T>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  handleRowClick: (row: T) => void;
}

function TableBody<T extends Record<string, unknown>>({
  columnVirtualizer,
  table,
  tableContainerRef,
  virtualPaddingLeft,
  virtualPaddingRight,
  handleRowClick,
}: TableBodyProps<T>) {
  const rows = table.getRowModel().rows;
  const isClient = useIsClient();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      isClient && navigator.userAgent.indexOf("Firefox") === -1
        ? (el) => el?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <tbody
      className="grid relative"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<T>;
        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
            columnVirtualizer={columnVirtualizer}
            virtualPaddingLeft={virtualPaddingLeft}
            virtualPaddingRight={virtualPaddingRight}
            handleRowClick={handleRowClick}
          />
        );
      })}
    </tbody>
  );
}

interface TableBodyRowProps<T> {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  row: Row<T>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  virtualRow: VirtualItem;
  handleRowClick: (row: T) => void;
}

function TableBodyRow<T extends Record<string, unknown>>({
  columnVirtualizer,
  row,
  rowVirtualizer,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualRow,
  handleRowClick,
}: TableBodyRowProps<T>) {
  const visibleCells = row.getVisibleCells();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  return (
    <tr
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      className="cursor-pointer flex w-full border-b border-border hover:bg-gray-50 dark:hover:bg-background/70"
      style={{
        position: "absolute",
        transform: `translateY(${virtualRow.start}px)`,
      }}
      onClick={() => handleRowClick(row.original)}
    >
      {virtualPaddingLeft ? <td className="flex" style={{ width: virtualPaddingLeft }} /> : null}

      {virtualColumns.map((vc) => {
        const cell = visibleCells[vc.index];
        return <TableBodyCell key={cell.id} cell={cell} />;
      })}

      {virtualPaddingRight ? <td className="flex" style={{ width: virtualPaddingRight }} /> : null}
    </tr>
  );
}

interface TableBodyCellProps<T> {
  cell: Cell<T, unknown>;
}

function TableBodyCell<T extends Record<string, unknown>>({ cell }: TableBodyCellProps<T>) {
  return (
    <td
      key={cell.id}
      className="grow flex items-center border-r border-border last:border-none"
      style={{ width: cell.column.getSize() }}
    >
      <div className="grow px-3 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
    </td>
  );
}
