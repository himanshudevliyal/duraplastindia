import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({
        shallow: false,
        throttleMs: 500,
      })
      .withDefault(""),
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setPage(1);
    setLimit(10);
  }, [setSearchQuery, setPage, setLimit]);

  const isAnyFilterActive = useMemo(() => {
    return Boolean(searchQuery);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,

    page,
    setPage,

    limit,
    setLimit,

    resetFilters,
    isAnyFilterActive,
  };
}
