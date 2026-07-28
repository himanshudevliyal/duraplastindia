"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  LoaderCircleIcon,
  Plus,
  Trash,
  Trash2,
  XIcon,
} from "lucide-react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "../ui/alert";
import { getFormErrors } from "@/lib/get-form-errors";
import { useEffect } from "react";
import Loader from "../loader";
import ErrorMessage from "../ui/error";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-uploader";
import { useState } from "react";
import Image from "next/image";
import config from "@/config";
import { useCallback } from "react";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import TextEditor from "../editor";
import CustomCommandMenu from "../custom-command-menu";
import { useFormattedCategories } from "@/hooks/use-categories";
import { z } from "zod";
import {
  useCreateProductPage,
  useProductPage,
  useUpdateProductPage,
} from "@/hooks/use-product-pages";
import CustomMultiSelect from "../custom-multi-select";

const defaultValues = {
  pictures: [],
  title: "",
  city: [],
  description: "",
  content: "",
  category_id: null,
  product_page_slug: "",

  overview: {
    heading: "",
    paragraphs: [""],
  },

  why_choose: {
    heading: "",
    short_paragraph: "",
    features: [
      {
        heading: "",
        short_paragraph: "",
      },
    ],
  },

  applications: {
    heading: "",
    short_paragraph: "",
    features: [
      {
        heading: "",
        paragraph: "",
        img: "",
      },
    ],
  },

  benefits: {
    heading: "",
    short_paragraph: "",
    features: [
      {
        heading: "",
        paragraph: "",
        img: "",
      },
    ],
  },

  faq: [],

  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  jsonld_schema: "",
};
const cityOptions = [
  { label: "India", value: "India" },
  { label: "Australia", value: "Australia" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Italy", value: "Italy" },
  { label: "Spain", value: "Spain" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "Belgium", value: "Belgium" },
  { label: "Sweden", value: "Sweden" },
  { label: "Norway", value: "Norway" },
  { label: "Denmark", value: "Denmark" },
  { label: "Switzerland", value: "Switzerland" },
  { label: "Austria", value: "Austria" },
  { label: "Poland", value: "Poland" },
  { label: "Czech Republic", value: "Czech Republic" },
  { label: "Turkey", value: "Turkey" },
  { label: "Russia", value: "Russia" },
  { label: "China", value: "China" },
  { label: "Japan", value: "Japan" },
  { label: "South Korea", value: "South Korea" },
  { label: "Singapore", value: "Singapore" },
  { label: "Malaysia", value: "Malaysia" },
  { label: "Thailand", value: "Thailand" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Vietnam", value: "Vietnam" },
  { label: "Philippines", value: "Philippines" },
  { label: "UAE", value: "UAE" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Qatar", value: "Qatar" },
  { label: "Oman", value: "Oman" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Bahrain", value: "Bahrain" },
  { label: "South Africa", value: "South Africa" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Kenya", value: "Kenya" },
  { label: "Egypt", value: "Egypt" },
  { label: "Brazil", value: "Brazil" },
  { label: "Mexico", value: "Mexico" },
  { label: "Argentina", value: "Argentina" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Nepal", value: "Nepal" },
  { label: "Pakistan", value: "Pakistan" },
];
export const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),

  city: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Atleast 1 city is required.")
    .transform((data) => data.map((d) => d.value)),
  description: z.string().optional().nullable(),

  content: z.string().optional().nullable(),

  category_id: z.string().uuid().optional().nullable(),

  product_page_slug: z
    .string()
    .trim()
    .min(1, "Product page slug is required.")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Invalid slug format",
    }),

  meta_title: z.string().optional(),

  meta_description: z.string().optional(),

  meta_keywords: z.string().optional(),

  jsonld_schema: z.any().optional(),

  overview: z
    .object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    })
    .optional()
    .nullable(),

  why_choose: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          short_paragraph: z
            .string()
            .trim()
            .min(1, "Short paragraph is required"),
        }),
      ),
    })
    .optional()
    .nullable(),

  applications: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          paragraph: z.string().trim().min(1, "Paragraph is required"),
          img: z.string().optional().nullable(),
        }),
      ),
    })
    .optional()
    .nullable(),

  benefits: z
    .object({
      heading: z.string().optional(),
      short_paragraph: z.string().optional(),
      features: z.array(
        z.object({
          heading: z.string().trim().min(1, "Heading is required"),
          paragraph: z.string().trim().min(1, "Paragraph is required"),
          img: z.string().optional().nullable(),
        }),
      ),
    })
    .optional()
    .nullable(),

  faq: z
    .array(
      z.object({
        q: z
          .string()
          .trim()
          .min(3, "Question must be atleast 3 characters long."),
        a: z
          .string()
          .trim()
          .min(3, "Answer must be atleast 3 characters long."),
      }),
    )
    .optional()
    .nullable(),
});

export default function ProductPageForm({ id, type }) {
  const router = useRouter();

  const [files, setFiles] = useState({
    pictures: [],
    applications: {},
    benefits: {},
  });
  const [fileUrls, setFileUrls] = useState({
    picture_urls: [],
  });
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
    watch,
    control,
  } = methods;
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: `faq` });

  const {
    fields: overviewParagraphs,
    append: appendOverviewParagraph,
    remove: removeOverviewParagraph,
  } = useFieldArray({
    control,
    name: "overview.paragraphs",
  });

  const {
    fields: whyChooseFeatures,
    append: appendWhyChooseFeature,
    remove: removeWhyChooseFeature,
  } = useFieldArray({
    control,
    name: "why_choose.features",
  });

  const {
    fields: applicationFeatures,
    append: appendApplicationFeature,
    remove: removeApplicationFeature,
  } = useFieldArray({
    control,
    name: "applications.features",
  });

  const {
    fields: benefitFeatures,
    append: appendBenefitFeature,
    remove: removeBenefitFeature,
  } = useFieldArray({
    control,
    name: "benefits.features",
  });

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
  console.log({ data });
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useFormattedCategories("");

  const onSubmit = (data) => {
    if (!fileUrls?.picture_urls?.length && !files.pictures.length) {
      return setError("pictures", {
        type: "manual",
        message: "Atleat 1 picture is required*",
      });
    }

    const formData = new FormData();

    // Product Images
    files.pictures.forEach((file) => {
      formData.append("pictures", file);
    });

    // Application Images
    Object.entries(files.applications).forEach(([index, fileList]) => {
      fileList?.forEach((file) => {
        formData.append(`applications_image_${index}`, file);
      });
    });

    // Benefit Images
    Object.entries(files.benefits).forEach(([index, fileList]) => {
      fileList?.forEach((file) => {
        formData.append(`benefits_image_${index}`, file);
      });
    });

    // Other Form Data
    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    });

    // Existing Images (Edit Mode)
    if (type === "edit") {
      Object.entries(fileUrls).forEach(([key, values]) => {
        formData.append(key, JSON.stringify(values));
      });
    }

    type === "create"
      ? createMutation.mutate(formData)
      : updateMutation.mutate(formData);
  };

  const formErrors = getFormErrors(errors);
  const hasErrors = formErrors.length > 0;
  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  useEffect(() => {
    if (type === "edit" && data) {
      setFileUrls((prev) => ({
        ...prev,
        picture_urls: data?.pictures ?? [],
      }));

      reset({
        ...data,
        city: cityOptions.filter((item) => data?.city?.includes(item.value)),
      });
    }
  }, [data, type, reset]);

  const handlePictureChange = useCallback((data) => {
    setFiles((prev) => ({ ...prev, pictures: data }));
  }, []);

  const handleApplicationImage = useCallback((index, newFiles) => {
    setFiles((prev) => ({
      ...prev,
      applications: {
        ...prev.applications,
        [index]: newFiles,
      },
    }));
  }, []);

  const handleBenefitImage = useCallback((index, newFiles) => {
    setFiles((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [index]: newFiles,
      },
    }));
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

  if (type === "edit" && isLoading) return <Loader />;
  if (type === "edit" && isError) return <ErrorMessage error={error} />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {/* images */}
          <div className="col-span-full space-y-4">
            <Label>Pictures</Label>
            <FileUpload
              onFileChange={handlePictureChange}
              inputName={"picture"}
              className={cn({ "border-red-500": errors.pictures })}
              initialFiles={[]}
              multiple={true}
              maxFiles={50}
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
            {/* product page id */}
            <div className="space-y-2">
              <Label htmlFor="product_page_slug">Product page slug *</Label>
              <Input
                {...register("product_page_slug")}
                placeholder="Enter product page slug"
              />
              {errors?.product_page_slug && (
                <span className="text-xs text-red-500">
                  {errors.product_page_slug?.message}
                </span>
              )}
            </div>

            {/* title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                className={cn({ "border-red-500": errors.title })}
                placeholder="Enter title"
              />
              {errors?.title && (
                <span className="text-xs text-red-500">
                  {errors.title?.message}
                </span>
              )}
            </div>

            {/* city */}
            <div className="space-y-2">
              <Label>Countries</Label>

              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <CustomMultiSelect
                    options={cityOptions}
                    value={field.value || []}
                    onChange={(value) => {
                      console.log({ value });
                      field.onChange(value);
                    }}
                    placeholder="Select Countries"
                    className={cn({
                      "border-red-500": errors.city,
                    })}
                  />
                )}
              />

              {errors?.city && (
                <span className="text-xs text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>

            {/*  category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => {
                  return (
                    <CustomCommandMenu
                      data={categories ?? []}
                      labelKey={"Category"}
                      searchPlaceholder="Search category"
                      onChange={field.onChange}
                      value={field.value}
                      isLoading={isCategoryLoading}
                      isError={isCategoryError}
                      error={categoryError}
                    />
                  );
                }}
              />
              {errors?.category_id && (
                <span className="text-xs text-red-500">
                  {errors.category_id?.message}
                </span>
              )}
            </div>

            {/* description */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className={cn({ "border-red-500": errors.description })}
                placeholder="Enter description"
              />
              {errors?.description && (
                <span className="text-xs text-red-500">
                  {errors.description?.message}
                </span>
              )}
            </div>

            {/* editor */}
            <div className="col-span-full space-y-2">
              <Label>Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  return (
                    <TextEditor
                      onChange={field.onChange}
                      value={field.value}
                      className="bg-background"
                    />
                  );
                }}
              />
            </div>

            {/* related products */}
            {/* <div className="col-span-full">
              <Label htmlFor="related_products">Related products</Label>
              <Controller
                id="related_products"
                control={control}
                name="related_products"
                render={({ field }) => {
                  return (
                    <CustomMultiSelect
                      options={productOptions?.filter(
                        ({ value }) => value !== id,
                      )}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Select related products"
                      async={true}
                      isLoading={isProductOptionsLoading}
                      isError={isProductOptionsError}
                      error={productOptionsError}
                    />
                  );
                }}
              />
            </div> */}

            {/* ================= Overview ================= */}
            <div className="col-span-full space-y-4 rounded-xl border p-5">
              <h3 className="text-2xl font-semibold">Overview</h3>

              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  {...register("overview.heading")}
                  placeholder="Enter overview heading"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Paragraphs</Label>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => appendOverviewParagraph("")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>

                {overviewParagraphs.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative rounded-lg border p-4"
                  >
                    {overviewParagraphs.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeOverviewParagraph(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <Textarea
                      rows={4}
                      placeholder={`Paragraph ${index + 1}`}
                      {...register(`overview.paragraphs.${index}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ================= Why Choose ================= */}
            <div className="col-span-full space-y-4 rounded-xl border p-5">
              <h3 className="text-2xl font-semibold">Why Choose</h3>

              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  {...register("why_choose.heading")}
                  placeholder="Enter heading"
                />
              </div>

              <div className="space-y-2">
                <Label>Short Paragraph</Label>
                <Textarea
                  rows={3}
                  {...register("why_choose.short_paragraph")}
                  placeholder="Enter short paragraph"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      appendWhyChooseFeature({
                        heading: "",
                        short_paragraph: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                {whyChooseFeatures.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative space-y-3 rounded-lg border p-4"
                  >
                    {whyChooseFeatures.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeWhyChooseFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label>Feature Heading</Label>
                      <Input
                        {...register(`why_choose.features.${index}.heading`)}
                        placeholder="Enter feature heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Short Paragraph</Label>
                      <Textarea
                        rows={3}
                        {...register(
                          `why_choose.features.${index}.short_paragraph`,
                        )}
                        placeholder="Enter short paragraph"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= Applications ================= */}
            <div className="col-span-full space-y-4 rounded-xl border p-5">
              <h3 className="text-2xl font-semibold">Applications</h3>

              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  {...register("applications.heading")}
                  placeholder="Enter heading"
                />
              </div>

              <div className="space-y-2">
                <Label>Short Paragraph</Label>
                <Textarea
                  rows={3}
                  {...register("applications.short_paragraph")}
                  placeholder="Enter short paragraph"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      appendApplicationFeature({
                        heading: "",
                        paragraph: "",
                        img: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                {applicationFeatures.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative space-y-3 rounded-lg border p-4"
                  >
                    {applicationFeatures.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeApplicationFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label>Feature Heading</Label>
                      <Input
                        {...register(`applications.features.${index}.heading`)}
                        placeholder="Feature heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Paragraph</Label>
                      <Textarea
                        rows={3}
                        {...register(
                          `applications.features.${index}.paragraph`,
                        )}
                        placeholder="Feature description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>

                      <FileUpload
                        inputName={`applications_image_${index}`}
                        multiple={false}
                        maxFiles={1}
                        initialFiles={[]}
                        onFileChange={(files) =>
                          handleApplicationImage(index, files)
                        }
                      />

                      {type === "edit" &&
                        watch(`applications.features.${index}.img`) && (
                          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            <div className="bg-accent relative aspect-square w-24 rounded-md">
                              <Image
                                src={`${config.file_base}/${watch(`applications.features.${index}.img`)}`}
                                width={200}
                                height={200}
                                className="size-full rounded-[inherit] object-cover"
                                alt={`application-${index}`}
                                unoptimized
                              />

                              <Button
                                type="button"
                                size="icon"
                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                onClick={() =>
                                  methods.setValue(
                                    `applications.features.${index}.img`,
                                    "",
                                  )
                                }
                              >
                                <XIcon className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= Benefits ================= */}
            <div className="col-span-full space-y-4 rounded-xl border p-5">
              <h3 className="text-2xl font-semibold">Benefits</h3>

              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  {...register("benefits.heading")}
                  placeholder="Enter heading"
                />
              </div>

              <div className="space-y-2">
                <Label>Short Paragraph</Label>
                <Textarea
                  rows={3}
                  {...register("benefits.short_paragraph")}
                  placeholder="Enter short paragraph"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      appendBenefitFeature({
                        heading: "",
                        paragraph: "",
                        img: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                {benefitFeatures.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative space-y-3 rounded-lg border p-4"
                  >
                    {benefitFeatures.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeBenefitFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label>Feature Heading</Label>
                      <Input
                        {...register(`benefits.features.${index}.heading`)}
                        placeholder="Feature heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Paragraph</Label>
                      <Textarea
                        rows={3}
                        {...register(`benefits.features.${index}.paragraph`)}
                        placeholder="Feature description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>

                      <FileUpload
                        inputName={`benefits_image_${index}`}
                        multiple={false}
                        maxFiles={1}
                        initialFiles={[]}
                        onFileChange={(files) =>
                          handleBenefitImage(index, files)
                        }
                      />

                      {type === "edit" &&
                        watch(`benefits.features.${index}.img`) && (
                          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            <div className="bg-accent relative aspect-square w-24 rounded-md">
                              <Image
                                src={`${config.file_base}/${watch(`benefits.features.${index}.img`)}`}
                                width={200}
                                height={200}
                                className="size-full rounded-[inherit] object-cover"
                                alt={`benefit-${index}`}
                                unoptimized
                              />

                              <Button
                                type="button"
                                size="icon"
                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                onClick={() =>
                                  methods.setValue(
                                    `benefits.features.${index}.img`,
                                    "",
                                  )
                                }
                              >
                                <XIcon className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full space-y-3">
              <div>
                <h3 className="mb-4 text-3xl font-semibold">FAQs</h3>

                <div className="space-y-2">
                  {faqFields.map((_, ind) => {
                    return (
                      <div key={ind} className="relative rounded-xl border p-3">
                        <Button
                          type={"button"}
                          onClick={() => removeFaq(ind)}
                          variant={"destructive"}
                          size={"icon"}
                          className={"absolute -top-2 -right-2"}
                        >
                          <Trash2 />
                        </Button>
                        <div>
                          <Label>Question*</Label>
                          <Input
                            {...register(`faq.${ind}.q`)}
                            placeholder="Question"
                          />
                        </div>
                        <div>
                          <Label>Answer*</Label>
                          <Textarea
                            {...register(`faq.${ind}.a`)}
                            placeholder="Answer"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                type="button"
                variant={"secondary"}
                size={"sm"}
                onClick={() => appendFaq({ q: "", a: "" })}
              >
                <Plus /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* seo */}
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold">SEO</h3>
          <div className="space-y-2">
            <div className="col-span-full space-y-2">
              <Label htmlFor="meta_title">Meta title</Label>
              <Input
                id="meta_title"
                {...register("meta_title")}
                className={cn({ "border-red-500": errors.meta_title })}
                placeholder="Enter meta title"
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label htmlFor="meta_description">Meta description</Label>
              <Textarea
                id="meta_description"
                {...register("meta_description")}
                className={cn({ "border-red-500": errors.meta_description })}
                placeholder="Enter meta description"
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label htmlFor="meta_keywords">Meta keywords</Label>
              <Textarea
                id="meta_keywords"
                {...register("meta_keywords")}
                className={cn({ "border-red-500": errors.meta_keywords })}
                placeholder="Enter meta keywords"
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label htmlFor="jsonld_schema">JsonLD Schema</Label>
              <Textarea
                id="jsonld_schema"
                {...register("jsonld_schema")}
                className={cn("h-40", {
                  "border-red-500": errors.jsonld_schema,
                })}
                placeholder="Enter schema"
              />
            </div>
          </div>
        </div>

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

function PricingItem({ index, removePricing, showStateDeleteButton }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const {
    fields: cityFields,
    append: appendCity,
    remove: removeCity,
  } = useFieldArray({ control, name: `pricing.${index}.cities` });

  return (
    <div className="border-input space-y-2 rounded-md border p-4">
      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="State Name"
          {...register(`pricing.${index}.name`)}
          className={cn({
            "border-red-500": errors?.pricing?.[index]?.name,
          })}
        />
        <Controller
          control={control}
          name={`pricing.${index}.cities.${cityIndex}.name`}
          render={({ field }) => (
            <CustomMultiSelect
              options={cityOptions}
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Select Countries"
              className={cn({
                "border-red-500":
                  errors?.pricing?.[index]?.cities?.[cityIndex]?.name,
              })}
            />
          )}
        />
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="font-medium">Cities</h4>
        {cityFields.map((city, cityIndex) => (
          <div
            key={city.id}
            className="border-muted grid grid-cols-4 items-center gap-4 rounded border p-2"
          >
            <Input
              placeholder="City Name"
              {...register(`pricing.${index}.cities.${cityIndex}.name`)}
              className={cn({
                "border-red-500":
                  errors?.pricing?.[index]?.cities?.[cityIndex]?.name,
              })}
            />
            <Input
              type="number"
              placeholder="Price Modifier"
              {...register(
                `pricing.${index}.cities.${cityIndex}.price_modifier`,
                { valueAsNumber: true },
              )}
              className={cn({
                "border-red-500":
                  errors?.pricing?.[index]?.cities?.[cityIndex]?.price_modifier,
              })}
            />
            <Button
              variant="destructive"
              type="button"
              size="icon"
              onClick={() => removeCity(cityIndex)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          onClick={() =>
            appendCity({
              id: "",
              name: [],
              price_modifier: "",
            })
          }
          className="mt-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" /> Add City
        </Button>
      </div>

      {showStateDeleteButton && (
        <div className="pt-2 text-right">
          <Button
            variant="destructive"
            type="button"
            size="icon"
            onClick={() => removePricing(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
