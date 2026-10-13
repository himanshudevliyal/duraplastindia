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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import Link from "next/link";

const sortHeader = (label) =>
  function SortHeader({ column }) {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };

const badges = (items) => (
  <div className="flex max-w-[260px] flex-wrap gap-1">
    {(items ?? []).map((item) => (
      <Badge key={item} variant="secondary">
        {item}
      </Badge>
    ))}
  </div>
);

export const columns = (openModal, setId) => [
  {
    accessorKey: "company_name",
    header: sortHeader("Company"),
    cell: ({ row }) => (
      <Link
        href={`/distributor-enquiries/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.company_name}
      </Link>
    ),
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <div>
        {row.original.city_region}, {row.original.country}
      </div>
    ),
  },
  {
    accessorKey: "business_type",
    header: "Business Type",
    cell: ({ row }) => badges(row.original.business_type),
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <div className="font-medium">{row.original.contact_person}</div>
        <div className="text-muted-foreground text-xs">
          {row.original.email}
        </div>
        <div className="text-muted-foreground text-xs">
          {row.original.mobile}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "products_of_interest",
    header: "Products",
    cell: ({ row }) => badges(row.original.products_of_interest),
  },
  {
    accessorKey: "created_at",
    header: sortHeader("Created On"),
    cell: ({ row }) => (
      <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const enquiry = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/distributor-enquiries/${enquiry.id}`}>View</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/distributor-enquiries/${enquiry.id}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setId(enquiry.id);
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
