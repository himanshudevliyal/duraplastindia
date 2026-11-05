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
import moment from "moment";
import Link from "next/link";
import { ArrowUpDown, ExternalLink, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  GLOBAL_COUNTRY,
  SITE_LOCALES,
  productUrl,
} from "@/components/forms/seo-tabs";

// main site of a product: Global if selected, else its first country
const primarySite = (city = []) =>
  city.includes(GLOBAL_COUNTRY) ? GLOBAL_COUNTRY : city[0];

export const columns = (openModal, setId) => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { slug, city } = row.original;
      const title = row.getValue("title");
      const site = primarySite(city);
      if (!site || !slug)
        return (
          <span className="block max-w-[320px] whitespace-normal">
            {title ?? "-"}
          </span>
        );
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={productUrl(site, slug)}
          className="hover:text-primary inline-flex max-w-[320px] items-start gap-1 font-medium whitespace-normal"
        >
          {title ?? "-"}
          <ExternalLink className="mt-1 size-3 shrink-0 opacity-60" />
        </a>
      );
    },
  },
  {
    accessorKey: "product_page_slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          URL slug <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className="text-muted-foreground block max-w-[240px] truncate font-mono text-xs"
        title={row.getValue("product_page_slug") ?? ""}
      >
        {row.getValue("product_page_slug") ?? "-"}
      </span>
    ),
  },
  {
    id: "sites",
    header: "Shown on",
    cell: ({ row }) => {
      // every saved country (same as the product form)
      const city = row.original.city || [];
      if (!city.length) return <span className="text-muted-foreground">-</span>;

      // compact: Global first, then up to MAX country codes, then "+N"
      const MAX = 5;
      const ordered = [
        ...city.filter((c) => c === GLOBAL_COUNTRY),
        ...city.filter((c) => c !== GLOBAL_COUNTRY),
      ];
      const shown = ordered.slice(0, MAX);
      const hidden = ordered.slice(MAX);

      return (
        <div
          className="flex w-[230px] flex-wrap items-center gap-1"
          title={ordered.join(", ")}
        >
          {shown.map((c) => (
            <Badge
              key={c}
              variant={c === GLOBAL_COUNTRY ? "default" : "outline"}
              className="h-6 px-2 text-[11px] font-medium"
            >
              {c === GLOBAL_COUNTRY ? (
                <>
                  <Globe /> Global
                </>
              ) : SITE_LOCALES[c] ? (
                SITE_LOCALES[c].toUpperCase()
              ) : (
                c
              )}
            </Badge>
          ))}
          {hidden.length > 0 && (
            <Badge
              variant="secondary"
              className="h-6 px-2 text-[11px] font-medium"
            >
              +{hidden.length}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created on <ArrowUpDown />
        </Button>
      );
    },
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
              <Link href={`/product-pages/${id}/edit`} className="w-full">
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setId(id);
                openModal("delete");
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