"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Globe, LoaderCircleIcon } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "../ui/alert";
import { getFormErrors } from "@/lib/get-form-errors";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Loader from "../loader";
import ErrorMessage from "../ui/error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  useCreateProductPage,
  useProductPage,
  useUpdateProductPage,
} from "@/hooks/use-product-pages";
import CustomMultiSelect from "../custom-multi-select";
import { GLOBAL_COUNTRY, withSavedOptions } from "./seo-tabs";
import {
  CountryContentTabs,
  countryTabSchema,
  emptyTab,
  fromTabFormValues,
  toTabFormValues,
} from "./country-content-tabs";

const IMAGE_SECTIONS = ["applications", "benefits"];

const defaultValues = {
  // selected sites: [{ label, value }] — "Global" = main site
  city: [],
  // { [country]: tab content incl. slug, category, pictures }
  // — see country-content-tabs.jsx
  country_content: {},
};

export const schema = z.object({
  city: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Select Global and/or at least 1 country.")
    .transform((data) => data.map((d) => d.value)),

  // only selected countries are kept in the form (see syncTabs)
  country_content: z.record(z.string(), countryTabSchema),
});

// "Global" first, then the countries in the order they were picked
const orderSites = (values) => [
  ...values.filter((v) => v === GLOBAL_COUNTRY),
  ...values.filter((v) => v !== GLOBAL_COUNTRY),
];

export default function ProductPageForm({ id, type }) {
  const router = useRouter();

  // new pictures per country: { [country]: File[] }
  const [pictureFiles, setPictureFiles] = useState({});
  // new application / benefit image per feature uid: { [uid]: File[] }
  const [imageFiles, setImageFiles] = useState({});
  // tabs of countries removed from the selection, restored if re-selected
  const removedTabs = useRef({});

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    getValues,
    watch,
    control,
  } = methods;

  const createMutation = useCreateProductPage(() => {
    reset();
    router.push("/product-pages?page=1&limit=10");
    toast.success("Created.");
  });
  const updateMutation = useUpdateProductPage(id, () => {
    reset();
    router.back();
    toast.success("Updated.");
  });

  const { data, isLoading, isError, error } = useProductPage(id);

  // sites + every country saved on this product (all of them are shown)
  const countryOptions = useMemo(
    () => withSavedOptions(data?.city),
    [data],
  );

  // Keeps one tab per selected country: a new country starts empty ("Copy
  // from…" in its tab fills it); a removed one is set aside and restored if
  // it is selected again.
  const syncTabs = useCallback(
    (selected) => {
      const current = getValues("country_content") || {};
      const values = selected.map((s) => s.value);
      const next = {};

      values.forEach((country) => {
        if (current[country]) {
          next[country] = current[country];
        } else if (removedTabs.current[country]) {
          next[country] = removedTabs.current[country];
          delete removedTabs.current[country];
        } else {
          next[country] = emptyTab();
        }
      });

      Object.keys(current).forEach((country) => {
        if (!values.includes(country)) {
          removedTabs.current[country] = current[country];
        }
      });

      setValue("country_content", next);
    },
    [getValues, setValue],
  );

  const onSubmit = (formValues) => {
    const countries = orderSites(formValues.city);

    // every tab needs at least 1 picture (saved or new)
    const noPicture = countries.filter(
      (c) =>
        !formValues.country_content[c]?.pictures?.length &&
        !pictureFiles[c]?.length,
    );
    if (noPicture.length) {
      noPicture.forEach((c) =>
        setError(`country_content.${c}.pictures`, {
          type: "manual",
          message: "At least 1 picture is required.",
        }),
      );
      return;
    }

    const formData = new FormData();

    // Country tabs + their new pictures and application / benefit images
    const countryContent = {};
    countries.forEach((country) => {
      const tab = formValues.country_content[country];

      (pictureFiles[country] || []).forEach((file) =>
        formData.append(`cc_pic__${encodeURIComponent(country)}`, file),
      );

      IMAGE_SECTIONS.forEach((section) =>
        (tab[section]?.features || []).forEach((feature, index) => {
          (imageFiles[feature.uid] || []).forEach((file) =>
            formData.append(
              `cc_img__${encodeURIComponent(country)}__${section}__${index}`,
              file,
            ),
          );
        }),
      );

      countryContent[country] = fromTabFormValues(tab);
    });

    const payload = {
      city: countries,
      country_content: countryContent,
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : value,
      );
    });

    type === "create"
      ? createMutation.mutate(formData)
      : updateMutation.mutate(formData);
  };

  const selectedCountries = watch("city") || [];

  const formErrors = getFormErrors(errors);
  const tabsWithErrors = Object.keys(errors?.country_content || {});
  const hasErrors = formErrors.length > 0 || tabsWithErrors.length > 0;
  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  useEffect(() => {
    if (type === "edit" && data) {
      const countries = orderSites(data?.city ?? []);
      const saved = data?.country_content || {};

      removedTabs.current = {};
      setImageFiles({});
      setPictureFiles({});
      reset({
        city: countries
          .map(
            (c) =>
              countryOptions.find((o) => o.value === c) ?? {
                label: c,
                value: c,
              },
          ),
        country_content: Object.fromEntries(
          countries
            // not migrated yet => the product's current content
            .map((c) => [c, toTabFormValues(saved[c] ?? data, data)]),
        ),
      });
    }
  }, [data, type, reset, countryOptions]);

  const handlePictureFiles = useCallback((country, newFiles) => {
    setPictureFiles((prev) => ({ ...prev, [country]: newFiles || [] }));
  }, []);

  const handleImageFile = useCallback((uid, newFiles) => {
    setImageFiles((prev) => {
      const next = { ...prev };
      if (newFiles?.length) next[uid] = newFiles;
      else delete next[uid];
      return next;
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(".tox-notifications-container");
      if (element) {
        element.style.display = "none";
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (type === "edit" && isLoading) return <Loader variant="product" />;
  if (type === "edit" && isError) return <ErrorMessage error={error} />;

  const labelOf = (value) =>
    countryOptions.find((o) => o.value === value)?.label ?? value;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        data-plain
      >
        {/* ================= Sites ================= */}
        <div className="bg-card space-y-5 rounded-[28px] border p-6 shadow">
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border">
              <Globe className="size-[18px]" />
            </span>
            <div>
              <p className="text-base font-semibold">Countries</p>
              <p className="text-muted-foreground text-xs">
                Select the countries for this product. Each country gets its own tab below.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {/* countries */}
            <div className="space-y-2">
              <Label>Countries *</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <CustomMultiSelect
                    options={countryOptions}
                    value={field.value || []}
                    onChange={(value) => {
                      field.onChange(value);
                      syncTabs(value || []);
                    }}
                    placeholder="Select countries (Global = main site)"
                    className={cn({
                      "border-red-500": errors.city,
                    })}
                  />
                )}
              />
              <p className="text-muted-foreground text-xs">
                The product is shown only in the selected countries. Without
                Global it is not shown on the main site.
              </p>
              {errors?.city && (
                <span className="text-xs text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= Content per country ================= */}
        <CountryContentTabs
          countries={selectedCountries}
          imageFiles={imageFiles}
          onImageFile={handleImageFile}
          pictureFiles={pictureFiles}
          onPictureFiles={handlePictureFiles}
        />

        {/* errors print */}
        {hasErrors && (
          <Alert variant="destructive" className="rounded-[20px]">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="mb-2 font-medium">
                Please fix the following errors:
              </div>
              <ul className="list-inside list-disc space-y-1">
                {formErrors.map((err, i) => (
                  <li key={i} className="text-sm">
                    {err}
                  </li>
                ))}
                {tabsWithErrors.map((country) => (
                  <li key={country} className="text-sm">
                    {labelOf(country)} tab: some fields are missing or invalid.
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* sticky action bar */}
        <div className="bg-card/90 supports-[backdrop-filter]:bg-card/70 sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-full border px-5 py-3 shadow-lg backdrop-blur">
          <p className="text-muted-foreground truncate text-sm">
            {selectedCountries.length
              ? `${selectedCountries.length} countr${selectedCountries.length === 1 ? "y" : "ies"} · ${type === "edit" ? "editing" : "new product"}`
              : "Select at least 1 country"}
          </p>
          <Button
            type="submit"
            disabled={isFormPending}
            className="h-10 rounded-full px-6"
          >
            {isFormPending && (
              <LoaderCircleIcon className="-ms-1 animate-spin" size={16} />
            )}
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
