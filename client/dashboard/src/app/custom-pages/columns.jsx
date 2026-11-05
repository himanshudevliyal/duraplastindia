"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { StatusBadge } from "@/components/forms/status-field";

const sortHeader = (label) =>
  function SortHeader({ column }) {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label} <ArrowUpDown />
      </Button>
    );
  };

export const columns = (openModal, setId) => [
  {
    accessorKey: "title",
    header: sortHeader("Title"),
  },
  {
    accessorKey: "slug",
    header: "URL",
    cell: ({ row }) => (
      <span className="font-mono text-xs">/{row.original.slug}</span>
    ),
  },
  {
    accessorKey: "city",
    header: "Countries",
    cell: ({ row }) => {
      const countries = row.original.city ?? [];
      if (!countries.length)
        return <span className="text-muted-foreground text-xs">All</span>;
      return (
        <div className="flex max-w-[260px] flex-wrap gap-1">
          {countries.map((country) => (
            <Badge key={country} variant="secondary">
              {country}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: sortHeader("Created on"),
    cell: ({ row }) => (
      <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-9 rounded-full p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/custom-pages/${id}/edit`} className="w-full">
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setId(id);
                openModal("delete");
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
