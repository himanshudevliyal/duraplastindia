"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import ErrorMessage from "@/components/ui/error";
import { DeleteDialog } from "@/components/dialog/delete-dialog";

import { columns } from "./columns";
import {
  useDistributorEnquiries,
  useDeleteDistributorEnquiry,
} from "@/hooks/use-distributor-enquiries";

export default function Listing() {
  const [id, setId] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();

  const { data, isLoading, isError, error } =
    useDistributorEnquiries(searchParamsStr);

  const deleteMutation = useDeleteDistributorEnquiry(id, () => {
    setIsDeleteModal(false);
  });

  const openModal = (type) => {
    if (type === "delete") setIsDeleteModal(true);
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  // API sends { status, data: { enquiries, total } }
  const payload = data?.enquiries ? data : (data?.data ?? {});

  return (
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(openModal, setId)}
        data={payload.enquiries ?? []}
        totalItems={payload.total ?? 0}
      />

      <DeleteDialog
        deleteMutation={deleteMutation}
        isOpen={isDeleteModal}
        setIsOpen={setIsDeleteModal}
      />
    </div>
  );
}
