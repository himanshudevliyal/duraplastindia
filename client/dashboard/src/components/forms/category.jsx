"use client";
// Category: groups products (menu / lists) and has its own page on every
// selected site: /category/<slug> (main site) and /<country>/category/<slug>.
// Every site has its own tab (title, H1, description, content, SEO, schema,
// FAQs) and its language versions (e.g. French, from Dashboard > Languages)
// in country_content[site].translations.
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { AlertCircle, Globe, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import ErrorMessage from "../ui/error";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import Loader from "../loader";
import FileUpload from "../file-uploader";
import TextEditor from "../editor";
import CustomMultiSelect from "../custom-multi-select";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import { fileUrl } from "@/lib/file-url";
import { getFormErrors } from "@/lib/get-form-errors";
import {
  FaqFields,
  GLOBAL_COUNTRY,
  SITE_LOCALES,
  SchemaFields,
  SeoFields,
  WEBSITE_URL,
  faqListSchema,
  fromSchemaList,
  schemaListSchema,
  toSchemaList,
  withSavedOptions,
} from "./seo-tabs";
import { StatusField, statusSchema } from "./status-field";
import {
  LanguageVersions,
  fromVersionsForm,
  toVersionsForm,
  versionsSchema,
} from "./language-versions";

// While typing: lowercase, anything except a-z / 0-9 becomes "-".
const toSlugInput = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");
const toSlug = (value = "") => toSlugInput(value).replace(/-+$/g, "");

// "Global" first, then the countries in the order they were picked
const orderSites = (values) => [
  ...values.filter((v) => v === GLOBAL_COUNTRY),
  ...values.filter((v) => v !== GLOBAL_COUNTRY),
];

// live URL of the category page on a site
const categoryUrl = (site, slug) =>
  `${WEBSITE_URL}${
    site === GLOBAL_COUNTRY || !SITE_LOCALES[site] ? "" : `/${SITE_LOCALES[site]}`
  }/category/${slug || "your-slug"}`;

const TAB_TEXT_FIELDS = [
  "title",
  "h1",
  "description",
  "content",
  "meta_title",
  "meta_description",
  "meta_keywords",
];

const emptyTab = () => ({
  ...Object.fromEntries(TAB_TEXT_FIELDS.map((f) => [f, ""])),
  schemas: [],
  faq: [],
  translations: {},
});

// saved tab => form values
const toTabForm = (tab = {}) => ({
  ...Object.fromEntries(TAB_TEXT_FIELDS.map((f) => [f, tab[f] ?? ""])),
  schemas: toSchemaList(tab.jsonld_schema),
  faq: tab.faq ?? [],
  translations: toVersionsForm(tab.translations),
});

// form values => saved tab
const fromTabForm = ({ schemas, translations, ...tab } = {}) => ({
  ...tab,
  jsonld_schema: fromSchemaList(schemas),
  translations: fromVersionsForm(translations),
});

const optional = z.string().optional().nullable();
const tabSchema = z.object({
  title: optional,
  h1: optional,
  description: optional,
  content: optional,
  meta_title: optional,
  meta_description: optional,
  meta_keywords: optional,
  schemas: schemaListSchema,
  faq: faqListSchema,
  translations: versionsSchema,
});

const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .transform(toSlug)
    .pipe(z.string().min(1, "Slug is required")),
  featured: z.boolean().optional().default(false),
  status: statusSchema,
  city: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Select Global and/or at least 1 country.")
    .transform((data) => data.map((d) => d.value)),
  country_content: z.record(z.string(), tabSchema),
});

const defaultValues = {
  title: "",
  slug: "",
  featured: false,
  status: "active",
  city: [],
  country_content: {},
};

export default function CategoryForm({ id, type = "create" }) {
  const router = useRouter();
  const [files, setFiles] = useState({ pictures: [] });
  const [fileUrls, setFileUrls] = useState({ picture_urls: [] });
  // the slug follows the title until it is edited by hand
  const [slugEdited, setSlugEdited] = useState(type === "edit");
  const [activeTab, setActiveTab] = useState(null);
  // tabs of unselected sites (restored if the site is selected again)
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
    control,
    setValue,
    getValues,
    watch,
    setError,
  } = methods;

  const handleSuccess = () => {
    reset();
    router.replace("/categories?page=1&limit=10");
  };
  const createMutation = useCreateCategory(handleSuccess);
  const updateMutation = useUpdateCategory(id, handleSuccess);
  const { data, isLoading, isError, error } = useCategory(id);

  const siteOptions = useMemo(() => withSavedOptions(data?.city), [data]);
  const labelOf = (value) =>
    value === GLOBAL_COUNTRY
      ? "Global"
      : (siteOptions.find((o) => o.value === value)?.label ?? value);

  // one tab per selected site
  const syncTabs = useCallback(
    (selected) => {
      const current = getValues("country_content") || {};
      const next = {};
      selected.forEach(({ value }) => {
        next[value] =
          current[value] ?? removedTabs.current[value] ?? emptyTab();
      });
      Object.keys(current).forEach((site) => {
        if (!next[site]) removedTabs.current[site] = current[site];
      });
      setValue("country_content", next);
    },
    [getValues, setValue],
  );

  useEffect(() => {
    if (type !== "edit" || !data) return;

    const sites = orderSites(data.city ?? []);
    const saved = data.country_content || {};
    removedTabs.current = {};
    setFileUrls({ picture_urls: data.pictures ?? [] });
    reset({
      title: data.title ?? "",
      slug: data.slug ?? "",
      featured: !!data.featured,
      status: data.status || "active",
      city: sites.map((value) => ({ value, label: labelOf(value) })),
      country_content: Object.fromEntries(
        sites.map((site) => [site, toTabForm(saved[site])]),
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type, reset]);

  const onSubmit = (values) => {
    if (!fileUrls.picture_urls?.length && !files.pictures.length) {
      toast.warning("Pictures required");
      return setError("pictures", {
        type: "manual",
        message: "At least 1 picture is required*",
      });
    }

    const sites = orderSites(values.city);
    const payload = {
      ...values,
      city: sites,
      country_content: Object.fromEntries(
        sites.map((site) => [site, fromTabForm(values.country_content[site])]),
      ),
    };

    const formData = new FormData();
    files.pictures.forEach((file) => formData.append("pictures", file));
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(
        key,
        value !== null && typeof value === "object"
          ? JSON.stringify(value)
          : (value ?? ""),
      );
    });
    if (type === "edit") {
      Object.entries(fileUrls).forEach(([key, list]) => {
        formData.append(key, JSON.stringify(list));
      });
    }

    type === "create"
      ? createMutation.mutate(formData)
      : updateMutation.mutate(formData);
  };

  const handlePictureChange = useCallback((list) => {
    setFiles((prev) => ({ ...prev, pictures: list }));
  }, []);

  const slugValue = toSlug(watch("slug"));
  const sites = orderSites((watch("city") || []).map((s) => s.value));
  const active = sites.includes(activeTab) ? activeTab : sites[0];
  const tabErrors = errors?.country_content || {};
  const formErrors = getFormErrors(errors);

  const copyFrom = (source) => {
    if (
      !window.confirm(
        `Replace all ${labelOf(active)} content with a copy of ${labelOf(source)}?`,
      )
    )
      return;
    const all = getValues("country_content");
    setValue(
      `country_content.${active}`,
      JSON.parse(JSON.stringify(all[source] ?? emptyTab())),
      { shouldDirty: true },
    );
    // remount the tab so its lists (FAQs, schemas) read the copied values
    setActiveTab(null);
    setTimeout(() => setActiveTab(active));
  };

  if (type === "edit" && isLoading) return <Loader />;
  if (type === "edit" && isError) return <ErrorMessage error={error} />;
  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ================= Category ================= */}
        <div className="bg-card space-y-6 rounded-[28px] border p-6 shadow">
          <div className="space-y-4">
            <Label>Pictures * (first picture = page banner)</Label>
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
                  key={src}
                >
                  <Image
                    src={fileUrl(src)}
                    width={200}
                    height={200}
                    className="size-full rounded-[inherit] object-cover"
                    alt={`picture-${index}`}
                  />
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        picture_urls: prev.picture_urls.filter((i) => i !== src),
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

          <Separator />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="title">Category name *</Label>
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
                placeholder="e.g. Roof Ventilation"
              />
              <p className="text-muted-foreground text-xs">
                Shown in the menu and product lists.
              </p>
              {errors.title && (
                <span className="text-xs text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>

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
                placeholder="roof-ventilation"
              />
              <p className="text-muted-foreground text-xs break-all">
                /category/{slugValue || "your-slug"} (country sites: /za/category/
                {slugValue || "your-slug"} …)
              </p>
              {errors.slug && (
                <span className="text-xs text-red-500">
                  {errors.slug.message}
                </span>
              )}
            </div>

            <StatusField />

            <div className="space-y-2 md:col-span-2">
              <Label>Sites with a category page *</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <CustomMultiSelect
                    options={siteOptions}
                    value={field.value || []}
                    onChange={(value) => {
                      field.onChange(value);
                      syncTabs(value || []);
                    }}
                    placeholder="Select countries (Global = main site)"
                    className={cn({ "border-red-500": errors.city })}
                  />
                )}
              />
              <p className="text-muted-foreground text-xs">
                Each site gets its own tab below. The page lists the products
                of this category on that site.
              </p>
              {errors.city && (
                <span className="text-xs text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-center">
              <Controller
                control={control}
                name="featured"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    id="featured"
                    onCheckedChange={onChange}
                    checked={!!value}
                  />
                )}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>
        </div>

        {/* ================= Content by site ================= */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-3xl font-semibold tracking-tight">
              Page content by site
            </h3>
            <p className="text-muted-foreground text-sm">
              Empty fields use the category name / saved meta. Use “Copy
              from…” to start a site from another one.
            </p>
          </div>

          {!sites.length ? (
            <div className="text-muted-foreground bg-card flex flex-col items-center gap-2 rounded-[28px] border border-dashed p-12 text-center shadow">
              <Globe className="size-5" />
              <p className="text-foreground font-medium">No site selected yet</p>
              <p className="max-w-sm text-sm">
                Pick Global and/or countries above. Each one gets its own tab.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-background/95 sticky top-0 z-20 -mx-1 px-1 py-2 backdrop-blur">
                <div
                  role="tablist"
                  className="bg-card flex gap-1 overflow-x-auto rounded-full border p-1.5 shadow"
                >
                  {sites.map((site) => (
                    <button
                      key={site}
                      type="button"
                      role="tab"
                      aria-selected={site === active}
                      onClick={() => setActiveTab(site)}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                        site === active
                          ? "bg-brand shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {site === GLOBAL_COUNTRY && <Globe className="size-4" />}
                      {labelOf(site)}
                      {tabErrors[site] && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                          !
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {active && (
                <SiteTab
                  key={active}
                  site={active}
                  label={labelOf(active)}
                  url={categoryUrl(active, slugValue)}
                  others={sites.filter((s) => s !== active)}
                  labelOf={labelOf}
                  onCopyFrom={copyFrom}
                />
              )}
            </>
          )}
        </div>

        {formErrors.length > 0 && (
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
          <Button type="submit" disabled={isFormPending}>
            {isFormPending && <Loader2 className="animate-spin" />} Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

// content of one site
function SiteTab({ site, label, url, others, labelOf, onCopyFrom }) {
  const { register, control } = useFormContext();
  const prefix = `country_content.${site}.`;

  return (
    <div className="bg-card space-y-6 rounded-[28px] border p-6 shadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-xl font-semibold">{label}</h4>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground text-xs break-all hover:underline"
          >
            {url}
          </a>
        </div>
        {others.length > 0 && (
          <select
            className="bg-background rounded-md border px-3 py-2 text-sm"
            value=""
            onChange={(e) => e.target.value && onCopyFrom(e.target.value)}
          >
            <option value="">Copy from…</option>
            {others.map((s) => (
              <option key={s} value={s}>
                {labelOf(s)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Page title</Label>
          <Input
            {...register(`${prefix}title`)}
            placeholder="Category name is used when empty"
          />
        </div>
        <div className="space-y-2">
          <Label>H1 (banner heading)</Label>
          <Input
            {...register(`${prefix}h1`)}
            placeholder="Page title is used when empty"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            {...register(`${prefix}description`)}
            placeholder="Short intro shown above the products"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Content (shown below the products)</Label>
          <Controller
            name={`${prefix}content`}
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

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SeoFields prefix={prefix} idKey={site.replace(/\W+/g, "_")} />
          <SchemaFields prefix={prefix} />
        </div>
        <FaqFields
          name={`${prefix}faq`}
          hint="Shown on the page with FAQPage schema."
        />
      </div>

      {/* other languages of this site (e.g. French) */}
      <LanguageVersions
        country={site}
        prefix={`${prefix}translations.`}
        kind="category"
        withPicker
      />
    </div>
  );
}
