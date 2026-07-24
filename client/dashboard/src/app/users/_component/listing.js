"use client";

import ErrorMessage from "@/components/ui/error";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "../columns";
import { DeleteDialog } from "@/components/dialog/delete-dialog";
import { useDeleteUser, useGetUsers, useUpdateUser } from "@/hooks/use-users";

export default function UserListing() {
  const [isModal, setIsModal] = useState(false);
  const [userId, setUserId] = useState("");
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const router = useRouter();

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const { data, isLoading, isFetching, isError, error } =
    useGetUsers(searchParamsStr);
  const deleteMutation = useDeleteUser(userId, closeModal);
  const updateMutation = useUpdateUser(userId);
  useEffect(() => {
    if (!searchParamsStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamsStr, router]);

  if (isLoading) return <DataTableSkeleton columnCount={6} rowCount={10} />;
  if (isError) return <ErrorMessage error={error?.message ?? "error"} />;

  return (
    <div className="border-input w-full rounded-lg">
      <DataTable
        columns={columns(updateMutation, setUserId, openModal)}
        data={data?.users ?? []}
        totalItems={data?.total}
      />
      <DeleteDialog
        deleteMutation={deleteMutation}
        isOpen={isModal}
        setIsOpen={setIsModal}
      />
    </div>
  );
}
