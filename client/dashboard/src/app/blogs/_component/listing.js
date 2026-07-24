"use client";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { columns } from "../columns";
import ErrorMessage from "@/components/ui/error";
import { DeleteDialog } from "@/components/dialog/delete-dialog";
import { useBlogs, useDeleteBlog } from "@/hooks/use-blogs";

export default function Listing() {
  const [id, setId] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const { data, isLoading, isError, error } = useBlogs(searchParamsStr);
  const deleteMutation = useDeleteBlog(id, () => {
    setIsDeleteModal(false);
  });

  const openModal = (type) => {
    if (type === "delete") {
      setIsDeleteModal(true);
    }
  };

  if (isLoading) return <DataTableSkeleton columnCount={4} rowCount={10} />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(openModal, setId)}
        data={data?.products ?? []}
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
