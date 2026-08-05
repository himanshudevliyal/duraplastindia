"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormattedCategories } from "@/hooks/use-categories";

export default function CategoryFilter({ placeholder = "Select Category" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories = [], isLoading } = useFormattedCategories();

  const selectedCategory = searchParams.get("categories") || "all";

  const handleChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("categories");
    } else {
      params.set("categories", value);
    }

    // Pagination reset
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-2">
      <Label>Category</Label>

      <Select
        value={selectedCategory}
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
