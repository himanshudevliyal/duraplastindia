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
import z from "zod";
import {
  useCityBlog,
  useCreateCityBlog,
  useUpdateCityBlog,
} from "@/hooks/use-city-blogs";

const defaultValues = {
  pictures: [],
  title: "",
  description: "",
  price: "",
  // related_products: [],
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
};

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  category_id: z.string().uuid(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  jsonld_schema: z.any(),
  faq: z
    .array(
      z.object({
        q: z.string().min(3, "Question must be atleast 3 characters long."),
        a: z.string().min(3, "Answer must be atleast 3 characters long."),
      }),
    )
    .optional()
    .nullable()
    .default([]),
});

export default function CityBlogForm({ id, type }) {
  const router = useRouter();

  const [files, setFiles] = useState({
    pictures: [],
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
    watch,
    setError,
    control,
  } = methods;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: `faq` });

  const createMutation = useCreateCityBlog(() => {
    reset();
    router.push("/cities?page=1&limit=10");
    toast.success("Created.");
  });
  const updateMutation = useUpdateCityBlog(id, () => {
    reset();
    router.back();
    toast.success("Updated.");
  });

  const { data, isLoading, isError, error } = useCityBlog(id);
  // const {
  //   data: productOptions,
  //   isLoading: isProductOptionsLoading,
  //   isError: isProductOptionsError,
  //   error: productOptionsError,
  // } = useFormattedProducts("");
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
    Object.entries(files).forEach(([key, value]) => {
      value?.forEach((file) => {
        formData.append(key, file);
      });
    });

    Object.entries(data).forEach(([key, value]) => {
      typeof value === "object"
        ? formData.append(key, JSON.stringify(value))
        : formData.append(key, value);
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

  const formErrors = getFormErrors(errors);
  const hasErrors = formErrors.length > 0;
  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  useEffect(() => {
    if (type === "edit" && data) {
      console.log({ data });
      setFileUrls((prev) => ({
        ...prev,
        picture_urls: data?.pictures ?? [],
      }));
      reset({
        ...data,
        // related_products: productOptions.filter((i) =>
        //   data?.related_products?.includes(i.value),
        // ),
      });
    }
  }, [data, type, reset, id]);

  const handlePictureChange = useCallback((data) => {
    setFiles((prev) => ({ ...prev, pictures: data }));
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
            {/* title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
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
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                className={cn({ "border-red-500": errors.city })}
                placeholder="Enter city"
              />
              {errors?.city && (
                <span className="text-xs text-red-500">
                  {errors.city?.message}
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
          </div>

          <div className="col-span-full space-y-3">
            <div>
              <h3 className="mb-4 text-3xl font-semibold">FAQs</h3>

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

        <Separator className="col-span-full" />

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
        <Input
          type="number"
          placeholder="Base Price"
          {...register(`pricing.${index}.price`, {
            valueAsNumber: true,
          })}
          className={cn({
            "border-red-500": errors?.pricing?.[index]?.price,
          })}
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
          onClick={() => appendCity({ id: "", name: "", price_modifier: "" })}
          className="mt-2"
          variant={"outline"}
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
