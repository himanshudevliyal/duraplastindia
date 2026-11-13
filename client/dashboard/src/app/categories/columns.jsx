"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";
import { StatusBadge } from "@/components/forms/status-field";
import { SITE_LOCALES, WEBSITE_URL } from "@/components/forms/seo-tabs";

export const columns = (openModal, setId, updateMutation) => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title");
      return (
        <div className="flex items-center justify-start gap-2 capitalize">
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Page URL",
    cell: ({ row }) => {
      const slug = row.getValue("slug");
      if (!slug) return <span className="text-muted-foreground">—</span>;
      return (
        <a
          href={`${WEBSITE_URL}/category/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground block max-w-[260px] truncate text-xs hover:underline"
          title={`/category/${slug}`}
        >
          /category/{slug}
        </a>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Sites",
    cell: ({ row }) => {
      const sites = row.getValue("city") || [];
      return (
        <div className="flex max-w-[220px] flex-wrap gap-1">
          {sites.length ? (
            sites.map((site) => (
              <span
                key={site}
                className="bg-muted rounded px-1.5 py-0.5 text-[11px] font-medium"
              >
                {site === "Global" ? "Global" : SITE_LOCALES[site]?.toUpperCase() || site}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">No page</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const id = row.original.id;
      const featured = row.getValue("featured");
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={featured}
            onCheckedChange={() => {
              setId(id);
              setTimeout(() => updateMutation.mutate({ featured: !featured }));
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created on",
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const role = row.original.role;
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
            <DropdownMenuItem>
              <Link href={`/categories/${id}/edit`} className="w-full">
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setId(id);
                openModal();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
