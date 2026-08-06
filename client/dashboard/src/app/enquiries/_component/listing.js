"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import ErrorMessage from "@/components/ui/error";
import { DeleteDialog } from "@/components/dialog/delete-dialog";

import { columns } from "./columns";
import { useEnquiries, useDeleteEnquiry } from "@/hooks/use-enquiries";

export default function Listing() {
  const [id, setId] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();

  const { data, isLoading, isError, error } = useEnquiries(searchParamsStr);

  const deleteMutation = useDeleteEnquiry(id, () => {
    setIsDeleteModal(false);
  });

  const openModal = (type) => {
    if (type === "delete") {
      setIsDeleteModal(true);
    }
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(openModal, setId)}
        data={data?.enquiries ?? []}
        totalItems={data?.total ?? 0}
      />

      <DeleteDialog
        deleteMutation={deleteMutation}
        isOpen={isDeleteModal}
        setIsOpen={setIsDeleteModal}
      />
    </div>
  );
}
