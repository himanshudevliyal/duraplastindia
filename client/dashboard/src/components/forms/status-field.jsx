"use client";
// Active / Draft select (blogs, custom pages). Draft = not shown on the website.
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

// empty / missing status (old records, or the Select clearing itself on a
// form reset) counts as "active"
export const statusSchema = z.preprocess(
  (v) => (v === "draft" ? "draft" : v || "active"),
  z.enum(["active", "draft"]),
);

export function StatusField() {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            value={field.value || "active"}
            // Radix Select fires onValueChange("") on reset — ignore it
            onValueChange={(v) => v && field.onChange(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <p className="text-muted-foreground text-xs">
        Draft is saved but not shown on the website.
      </p>
    </div>
  );
}

// list column cell
export function StatusBadge({ status }) {
  const draft = status === "draft";
  return (
    <span
      className={
        draft
          ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
          : "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
      }
    >
      {draft ? "Draft" : "Active"}
    </span>
  );
}
