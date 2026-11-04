"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircleIcon, XIcon } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "../ui/alert";
import { getFormErrors } from "@/lib/get-form-errors";
import { useCallback, useEffect, useState } from "react";
import Loader from "../loader";
import ErrorMessage from "../ui/error";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-uploader";
import Image from "next/image";
import config from "@/config";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import TextEditor from "../editor";
import z from "zod";
import CustomMultiSelect from "../custom-multi-select";
import {
  useCreateCustomPage,
  useCustomPage,
  useUpdateCustomPage,
} from "@/hooks/use-custom-pages";
import {
  SeoTabs,
  applySeoPayload,
  cityOptions,
  countrySeoSchema,
  faqListSchema,
  schemaListSchema,
  toSeoFormValues,
} from "./seo-tabs";
import { StatusField, statusSchema } from "./status-field";

// While typing: lowercase, anything except a-z / 0-9 becomes "-".
// Leading / trailing "-" are removed on save (and by the server).
const toSlugInput = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");

const toSlug = (value = "") => toSlugInput(value).replace(/-+$/g, "");

const defaultValues = {
  title: "",
  slug: "",
  description: "",
  content: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  status: "active",
  // countries the page is shown in (none selected => every country)
  city: [],
  faq: [],
  jsonld_schema: "",
  // form-only list of schema boxes [{ value }], saved as jsonld_schema
  schemas: [],
  // country-wise SEO: { [country]: { meta_title, meta_description, meta_keywords, jsonld_schema, faq } }
  country_seo: {},
};

export const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .transform(toSlug)
    .pipe(z.string().min(1, "Slug is required")),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  city: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional()
    .nullable()
    .transform((data) => (data ?? []).map((d) => d.value)),
  status: statusSchema,
  jsonld_schema: z.any().optional(),
  schemas: schemaListSchema,
  faq: faqListSchema,
  country_seo: countrySeoSchema,
});

export default function CustomPageForm({ id, type }) {
  const router = useRouter();

  const [files, setFiles] = useState({ pictures: [] });
  const [fileUrls, setFileUrls] = useState({ picture_urls: [] });
  // the slug follows the title until it is edited by hand
  const [slugEdited, setSlugEdited] = useState(type === "edit");

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = methods;

  const createMutation = useCreateCustomPage(() => {
    reset();
    router.push("/custom-pages?page=1&limit=10");
    toast.success("Created.");
  });
  const updateMutation = useUpdateCustomPage(id, () => {
    reset();
    router.push("/custom-pages?page=1&limit=10");
    toast.success("Updated.");
  });
  const { data, isLoading, isError, error } = useCustomPage(id);

  const onSubmit = (data) => {
    // schema boxes => jsonld_schema; country blocks only for selected countries
    applySeoPayload(data, data.city);

    const formData = new FormData();
    files.pictures.forEach((file) => formData.append("pictures", file));

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        value !== null && typeof value === "object"
          ? JSON.stringify(value)
          : (value ?? ""),
      );
    });

    if (type === "edit") {
      Object.entries(fileUrls).forEach(([key, values]) => {
        formData.append(key, JSON.stringify(values));
      });
    }

    type === "create"
      ? createMutation.mutate(formData)
      : updateMutation.mutate(formData);
  };

  const selectedCountries = watch("city") || [];
  const slugValue = watch("slug");

  const formErrors = getFormErrors(errors);
  const hasErrors = formErrors.length > 0;
  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  useEffect(() => {
    if (type === "edit" && data) {
      setFileUrls({ picture_urls: data?.pictures ?? [] });
      reset({
        ...defaultValues,
        ...data,
        status: data.status || "active",
        city: cityOptions.filter((item) => data?.city?.includes(item.value)),
        ...toSeoFormValues(data),
      });
    }
  }, [data, type, reset]);

  const handlePictureChange = useCallback((data) => {
    setFiles((prev) => ({ ...prev, pictures: data }));
  }, []);

  if (type === "edit" && isLoading) return <Loader />;
  if (type === "edit" && isError) return <ErrorMessage error={error} />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {/* images (optional, shown as the page banner) */}
          <div className="col-span-full space-y-4">
            <Label>Banner picture (optional)</Label>
            <FileUpload
              onFileChange={handlePictureChange}
              inputName={"picture"}
              initialFiles={[]}
              multiple={false}
              maxFiles={1}
            />

            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {fileUrls.picture_urls?.map((src, index) => (
                <div
                  className="bg-accent relative aspect-square w-24 rounded-md"
                  key={index}
                >
                  <Image
                    src={`${config.file_base}/${src}`}
                    width={200}
                    height={200}
                    className="size-full rounded-[inherit] object-cover"
                    alt={`picture-${index}`}
                    unoptimized
                  />
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        picture_urls: prev.picture_urls.filter(
                          (i) => i !== src,
                        ),
                      }))
                    }
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator className="col-span-full" />

          <div className="col-span-full grid grid-cols-3 gap-4">
            {/* title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title", {
                  onChange: (e) => {
                    if (!slugEdited) {
                      setValue("slug", toSlug(e.target.value), {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
                className={cn({ "border-red-500": errors.title })}
                placeholder="Enter title"
              />
              {errors?.title && (
                <span className="text-xs text-red-500">
                  {errors.title?.message}
                </span>
              )}
            </div>

            {/* slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug *</Label>
              <Input
                id="slug"
                {...register("slug", {
                  onChange: (e) => {
                    setSlugEdited(true);
                    setValue("slug", toSlugInput(e.target.value));
                  },
                })}
                className={cn({ "border-red-500": errors.slug })}
                placeholder="my-page"
              />
              <p className="text-muted-foreground text-xs">
                Page URL: /{toSlug(slugValue) || "your-slug"} (country sites: /in/
                {toSlug(slugValue) || "your-slug"} …)
              </p>
              {errors?.slug && (
                <span className="text-xs text-red-500">
                  {errors.slug?.message}
                </span>
              )}
            </div>

            {/* countries */}
            <div className="space-y-2">
              <Label>Countries</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <CustomMultiSelect
                    options={cityOptions}
                    value={field.value || []}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Select Countries"
                    className={cn({ "border-red-500": errors.city })}
                  />
                )}
              />
              <p className="text-muted-foreground text-xs">
                Leave empty to show this page in every country.
              </p>
            </div>

            <StatusField />

            {/* description */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Short intro shown under the page title"
              />
            </div>

            {/* editor */}
            <div className="col-span-full space-y-2">
              <Label>Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextEditor
                    onChange={field.onChange}
                    value={field.value}
                    className="bg-background"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <Separator className="col-span-full" />

        {/* seo, faqs & schema: Global tab + one tab per selected country */}
        <SeoTabs countries={selectedCountries} />

        {/* errors print */}
        {hasErrors && (
          <Alert variant="destructive">
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
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-end">
          <Button
            type="submit"
            disabled={isFormPending}
            className="w-full sm:w-auto"
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
