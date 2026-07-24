"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { columns } from "../columns";
import { DeleteDialog } from "./delete-dialog";
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import ErrorMessage from "@/components/ui/error";

export default function Listing() {
  const [id, setId] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();
  const { data, isLoading, isError, error } = useCategories(searchParamsStr);
  const deleteMutation = useDeleteCategory(id, () => {
    setIsModal(false);
  });
  const updateMutation = useUpdateCategory(id);

  const openModal = () => setIsModal(true);

  if (isLoading) return <DataTableSkeleton columnCount={4} rowCount={10} />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(openModal, setId, updateMutation)}
        data={data?.categories ?? []}
        totalItems={data?.total ?? 0}
      />
      <DeleteDialog
        deleteMutation={deleteMutation}
        isOpen={isModal}
        setIsOpen={setIsModal}
        id={id}
      />
    </div>
  );
}
