"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect } from "react";

export function DataTable({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }),
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withOptions({ shallow: false, history: "push" }),
  );

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize: pageSize,
  };

  const pageCount = Math.ceil(totalItems / pageSize);
  const handlePaginationChange = (updaterOrValue) => {
    const pagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1); // converting zero-based index to one-based
    setPageSize(pagination.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      pagination: paginationState,
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  useEffect(() => {
    if (currentPage < 1) {
      setCurrentPage(1); // Ensure page is at least 1
    }
  }, [currentPage, setCurrentPage]);

  const from = paginationState.pageIndex * paginationState.pageSize + 1;
  const to = Math.min(
    (paginationState.pageIndex + 1) * paginationState.pageSize,
    totalItems,
  );
  const pagerButton = "size-9 rounded-full p-0";

  return (
    <div className="bg-card flex flex-col rounded-[28px] border p-2 shadow">
      <Table containerClassName="max-h-[calc(100svh-320px)] min-h-40 overflow-auto rounded-[22px]">
        <TableHeader className="bg-muted sticky top-0 z-10 backdrop-blur [&_th:first-child]:rounded-l-2xl [&_th:last-child]:rounded-r-2xl [&_tr]:border-0 [&_tr:hover]:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      ...getCommonPinningStyles({ column: cell.column }),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-muted-foreground h-40 text-center"
              >
                Nothing here yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* footer: count · rows per page · pager */}
      <div className="flex flex-col gap-3 px-3 pt-3 pb-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {totalItems > 0 ? (
            <>
              Showing <span className="text-foreground font-medium">{from}</span>
              –<span className="text-foreground font-medium">{to}</span> of{" "}
              <span className="text-foreground font-medium">{totalItems}</span>
            </>
          ) : (
            "No entries"
          )}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              Rows
            </span>
            <Select
              value={`${paginationState.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-[76px]">
                <SelectValue placeholder={paginationState.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm whitespace-nowrap">
            Page{" "}
            <span className="font-medium">
              {totalItems > 0 ? paginationState.pageIndex + 1 : 0}
            </span>{" "}
            of <span className="font-medium">{table.getPageCount() || 0}</span>
          </span>

          <div className="flex items-center gap-1">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className={`${pagerButton} hidden lg:flex`}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className={pagerButton}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className={pagerButton}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className={`${pagerButton} hidden lg:flex`}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
