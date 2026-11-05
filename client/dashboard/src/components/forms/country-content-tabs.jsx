"use client";
// Product page content per site: one tab per selected country ("Global" =
// main site). Every tab has its own URL slug, category, pictures, title,
// description, content, sections, images, SEO, FAQs and schema. Form values
// live in country_content.<country>.<field>.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-uploader";
import TextEditor from "../editor";
import CustomCommandMenu from "../custom-command-menu";
import { useFormattedCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { fileUrl } from "@/lib/file-url";
import {
  AlignLeft,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  ImageIcon,
  ImagePlus,
  LayoutGrid,
  Plus,
  Search,
  Sparkles,
  Trash2,
  XIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FaqFields,
  GLOBAL_COUNTRY,
  SchemaFields,
  SeoFields,
  faqListSchema,
  fromSchemaList,
  productUrl,
  schemaListSchema,
  toSchemaList,
} from "./seo-tabs";

// ================= Data helpers =================
// While typing: lowercase, anything except a-z / 0-9 becomes "-".
const toSlugInput = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");
const toSlug = (value = "") => toSlugInput(value).replace(/-+$/g, "");

const newUid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const emptyTab = () => ({
  slug: "",
  category_id: null,
  pictures: [],
  title: "",
  description: "",
  content: "",
  overview: { heading: "", paragraphs: [""] },
  why_choose: {
    heading: "",
    short_paragraph: "",
    features: [{ heading: "", short_paragraph: "" }],
  },
  applications: {
    heading: "",
    short_paragraph: "",
    features: [{ uid: newUid(), heading: "", paragraph: "", img: "" }],
  },
  benefits: {
    heading: "",
    short_paragraph: "",
    features: [{ uid: newUid(), heading: "", paragraph: "", img: "" }],
  },
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  schemas: [],
  faq: [],
});

const sectionOf = (value, withUid) => ({
  heading: value?.heading ?? "",
  short_paragraph: value?.short_paragraph ?? "",
  features: (value?.features ?? []).map((f) =>
    withUid
      ? {
          uid: newUid(),
          heading: f?.heading ?? "",
          paragraph: f?.paragraph ?? "",
          img: f?.img ?? "",
        }
      : {
          heading: f?.heading ?? "",
          short_paragraph: f?.short_paragraph ?? "",
        },
  ),
});

// API tab => form values. `base`: the product record (fallback for old
// tabs without a slug / category / pictures).
export const toTabFormValues = (tab = {}, base = {}) => ({
  slug: tab.slug ?? base.slug ?? "",
  category_id: tab.category_id ?? base.category_id ?? null,
  pictures: [...(tab.pictures ?? base.pictures ?? [])],
  title: tab.title ?? "",
  description: tab.description ?? "",
  content: tab.content ?? "",
  overview: {
    heading: tab.overview?.heading ?? "",
    paragraphs: tab.overview?.paragraphs?.length
      ? [...tab.overview.paragraphs]
      : [""],
  },
  why_choose: sectionOf(tab.why_choose, false),
  applications: sectionOf(tab.applications, true),
  benefits: sectionOf(tab.benefits, true),
  meta_title: tab.meta_title ?? "",
  meta_description: tab.meta_description ?? "",
  meta_keywords: tab.meta_keywords ?? "",
  schemas: toSchemaList(tab.jsonld_schema),
  faq: (tab.faq ?? []).map((f) => ({ q: f.q ?? "", a: f.a ?? "" })),
});

// Copy of a tab for a newly added country (new image uids, same images)
export const copyTab = (tab) =>
  JSON.parse(
    JSON.stringify(tab, (key, value) => (key === "uid" ? newUid() : value)),
  );

// form values => API tab (schema boxes => jsonld_schema)
export const fromTabFormValues = ({ schemas, ...tab }) => ({
  ...tab,
  jsonld_schema: fromSchemaList(schemas),
});

// ================= Validation =================
const featureWithImage = z.object({
  uid: z.string().optional(),
  heading: z.string().trim().min(1, "Heading is required"),
  paragraph: z.string().trim().min(1, "Paragraph is required"),
  img: z.string().optional().nullable(),
});

const imageSection = z.object({
  heading: z.string().optional(),
  short_paragraph: z.string().optional(),
  features: z.array(featureWithImage),
});

export const countryTabSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Only a-z, 0-9 and single hyphens."),
  category_id: z.string().uuid().optional().nullable(),
  pictures: z.array(z.string()),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  overview: z.object({
    heading: z.string().optional(),
    paragraphs: z.array(z.string()),
  }),
  why_choose: z.object({
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
  }),
  applications: imageSection,
  benefits: imageSection,
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  schemas: schemaListSchema,
  faq: faqListSchema,
});

// ================= Tabs =================
// countries: selected options [{ label, value }]; Global is always first.
// imageFiles / onImageFile: new image per feature uid (kept by the form).
// pictureFiles / onPictureFiles: new pictures per country (kept by the form).
export function CountryContentTabs({
  countries,
  imageFiles,
  onImageFile,
  pictureFiles,
  onPictureFiles,
}) {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const tabs = useMemo(
    () =>
      [...countries].sort(
        (a, b) =>
          (b.value === GLOBAL_COUNTRY) - (a.value === GLOBAL_COUNTRY),
      ),
    [countries],
  );

  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  // bumped after "Copy from" so the tab's lists re-read the copied values
  const [version, setVersion] = useState(0);
  const active = tabs.some((t) => t.value === activeTab)
    ? activeTab
    : tabs[0]?.value;

  if (!tabs.length) {
    return (
      <div className="text-muted-foreground bg-card flex flex-col items-center gap-2 rounded-[28px] border border-dashed p-12 text-center shadow">
        <div className="mb-1 flex size-14 items-center justify-center rounded-full border">
          <Globe className="size-5" />
        </div>
        <p className="text-foreground font-medium">No country selected yet</p>
        <p className="max-w-sm text-sm">
          Pick Global and/or countries above. Each one gets its own tab with
          its own URL, pictures and content.
        </p>
      </div>
    );
  }

  const activeLabel = tabs.find((t) => t.value === active)?.label;
  const shortLabel = (tab) =>
    tab.value === GLOBAL_COUNTRY ? "Global" : tab.label;

  const copyFrom = (source) => {
    const ok = window.confirm(
      `Replace all ${shortLabel({ value: active, label: activeLabel })} content with a copy of ${source}? (URL slug is kept.)`,
    );
    if (!ok) return;
    const all = getValues("country_content");
    const copy = copyTab(all[source]);
    copy.slug = all[active]?.slug ?? copy.slug;
    setValue(`country_content.${active}`, copy, { shouldDirty: true });
    setVersion((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-3xl font-semibold tracking-tight">
          Content by country
        </h3>
        <p className="text-muted-foreground text-sm">
          Every country has its own page. A new country starts empty — use
          “Copy from…” to fill it from another country.
        </p>
      </div>

      {/* tab bar stays visible while scrolling the long form */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 -mx-1 px-1 py-2 backdrop-blur">
        <div
          role="tablist"
          className="bg-card flex gap-1 overflow-x-auto rounded-full border p-1.5 shadow"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === active;
            const hasError = !!errors?.country_content?.[tab.value];
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {tab.value === GLOBAL_COUNTRY && <Globe className="size-4" />}
                {shortLabel(tab)}
                {hasError && (
                  <span
                    className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                    aria-label="has errors"
                  >
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TabHeader
        country={active}
        label={shortLabel({ value: active, label: activeLabel })}
        others={tabs.filter((t) => t.value !== active)}
        onCopyFrom={copyFrom}
        shortLabel={shortLabel}
      />

      {/* key: lists re-initialise for every tab (and after a copy) */}
      <TabContent
        key={`${active}-${version}`}
        country={active}
        label={shortLabel({ value: active, label: activeLabel })}
        imageFiles={imageFiles}
        onImageFile={onImageFile}
        pictureFiles={pictureFiles[active] || []}
        onPictureFiles={(files) => onPictureFiles(active, files)}
      />
    </div>
  );
}

// Site name, live URL and "Copy from" of the open tab
function TabHeader({ country, label, others, onCopyFrom, shortLabel }) {
  const { watch } = useFormContext();
  const slug = watch(`country_content.${country}.slug`);
  const url = slug ? productUrl(country, slug) : null;

  return (
    <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-[24px] border px-6 py-4 shadow">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label} page</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary inline-flex max-w-full items-center gap-1 truncate text-xs"
          >
            <span className="truncate">{url}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ) : (
          <p className="text-muted-foreground text-xs">Add a URL slug below.</p>
        )}
      </div>

      {others.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full px-4"
            >
              <Copy className="size-4" /> Copy from…
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {others.map((tab) => (
              <DropdownMenuItem
                key={tab.value}
                onClick={() => onCopyFrom(tab.value)}
              >
                {shortLabel(tab)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// ================= One tab =================
function TabContent({
  country,
  label,
  imageFiles,
  onImageFile,
  pictureFiles,
  onPictureFiles,
}) {
  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useFormattedCategories("");
  const prefix = `country_content.${country}.`;
  const tabErrors = errors?.country_content?.[country] || {};

  const {
    fields: paragraphs,
    append: appendParagraph,
    remove: removeParagraph,
  } = useFieldArray({ control, name: `${prefix}overview.paragraphs` });

  const {
    fields: whyFeatures,
    append: appendWhy,
    remove: removeWhy,
  } = useFieldArray({ control, name: `${prefix}why_choose.features` });

  const tab = watch(`country_content.${country}`) || {};
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const savedPictures = tab.pictures?.length || 0;
  const seoFilled = ["meta_title", "meta_description", "meta_keywords"].filter(
    (k) => tab[k]?.trim?.(),
  ).length;

  return (
    <div className="space-y-4">
      {/* ================= Basics ================= */}
      <Section
        icon={FileText}
        title="Basics"
        summary="URL, category, title and short description"
        defaultOpen
        hasError={!!(tabErrors.slug || tabErrors.title)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${country}-slug`}>URL slug *</Label>
            <Input
              id={`${country}-slug`}
              {...register(`${prefix}slug`, {
                onChange: (e) =>
                  setValue(`${prefix}slug`, toSlugInput(e.target.value)),
                onBlur: (e) =>
                  setValue(`${prefix}slug`, toSlug(e.target.value), {
                    shouldValidate: true,
                  }),
              })}
              className={cn({ "border-red-500": tabErrors.slug })}
              placeholder="e.g. rhino-tuff-polycarbonate-sheet"
            />
            {tabErrors.slug ? (
              <span className="text-xs text-red-500">
                {tabErrors.slug.message}
              </span>
            ) : (
              <p className="text-muted-foreground text-xs">
                Changing it changes the live URL.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              control={control}
              name={`${prefix}category_id`}
              render={({ field }) => (
                <CustomCommandMenu
                  data={categories ?? []}
                  searchPlaceholder="Search category"
                  onChange={field.onChange}
                  value={field.value}
                  isLoading={isCategoryLoading}
                  isError={isCategoryError}
                  error={categoryError}
                />
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${country}-title`}>Title *</Label>
            <Input
              id={`${country}-title`}
              {...register(`${prefix}title`, {
                // first title => slug, if the slug is still empty
                onBlur: (e) => {
                  if (!getValues(`${prefix}slug`)) {
                    setValue(`${prefix}slug`, toSlug(e.target.value), {
                      shouldValidate: true,
                    });
                  }
                },
              })}
              className={cn({ "border-red-500": tabErrors.title })}
              placeholder={`${label} product title`}
            />
            {tabErrors.title && (
              <span className="text-xs text-red-500">
                {tabErrors.title.message}
              </span>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${country}-description`}>Short description</Label>
            <Textarea
              id={`${country}-description`}
              rows={3}
              {...register(`${prefix}description`)}
              placeholder="One or two lines shown in product cards"
            />
          </div>
        </div>
      </Section>

      {/* ================= Pictures ================= */}
      <Section
        icon={ImageIcon}
        title="Pictures"
        summary={
          savedPictures || pictureFiles.length
            ? `${plural(savedPictures, "saved picture")}${pictureFiles.length ? ` + ${pictureFiles.length} new` : ""}`
            : "At least 1 picture is required"
        }
        defaultOpen
        hasError={!!tabErrors.pictures}
      >
        <TabPictures
          name={`${prefix}pictures`}
          error={tabErrors.pictures?.message}
          pending={pictureFiles}
          onPending={onPictureFiles}
        />
      </Section>

      {/* ================= Content ================= */}
      <Section
        icon={AlignLeft}
        title="Content"
        summary="Rich text shown on the product page"
      >
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
      </Section>

      {/* ================= Overview ================= */}
      <Section
        icon={BookOpen}
        title="Overview"
        summary={plural(paragraphs.length, "paragraph")}
      >
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            {...register(`${prefix}overview.heading`)}
            placeholder="Overview heading"
          />
        </div>

        <ListHeader label="Paragraphs" onAdd={() => appendParagraph("")}>
          Add paragraph
        </ListHeader>
        {paragraphs.map((field, index) => (
          <Item
            key={field.id}
            index={index}
            onRemove={
              paragraphs.length > 1 ? () => removeParagraph(index) : null
            }
          >
            <Textarea
              rows={4}
              placeholder={`Paragraph ${index + 1}`}
              {...register(`${prefix}overview.paragraphs.${index}`)}
            />
          </Item>
        ))}
      </Section>

      {/* ================= Why Choose ================= */}
      <Section
        icon={Sparkles}
        title="Why Choose"
        summary={plural(whyFeatures.length, "feature")}
        hasError={!!tabErrors.why_choose}
      >
        <HeadingFields prefix={`${prefix}why_choose.`} />

        <ListHeader
          label="Features"
          onAdd={() => appendWhy({ heading: "", short_paragraph: "" })}
        >
          Add feature
        </ListHeader>
        {whyFeatures.map((field, index) => {
          const err = tabErrors.why_choose?.features?.[index] || {};
          return (
            <Item
              key={field.id}
              index={index}
              onRemove={whyFeatures.length > 1 ? () => removeWhy(index) : null}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    {...register(
                      `${prefix}why_choose.features.${index}.heading`,
                    )}
                    className={cn({ "border-red-500": err.heading })}
                    placeholder="Feature heading"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short paragraph</Label>
                  <Textarea
                    rows={2}
                    {...register(
                      `${prefix}why_choose.features.${index}.short_paragraph`,
                    )}
                    className={cn({ "border-red-500": err.short_paragraph })}
                    placeholder="Short paragraph"
                  />
                </div>
              </div>
            </Item>
          );
        })}
      </Section>

      <ImageFeatureSection
        icon={LayoutGrid}
        title="Applications"
        name={`${prefix}applications`}
        errors={tabErrors.applications}
        imageFiles={imageFiles}
        onImageFile={onImageFile}
      />

      <ImageFeatureSection
        icon={BadgeCheck}
        title="Benefits"
        name={`${prefix}benefits`}
        errors={tabErrors.benefits}
        imageFiles={imageFiles}
        onImageFile={onImageFile}
      />

      {/* ================= SEO, FAQs & Schema ================= */}
      <Section
        icon={Search}
        title="SEO, FAQs & Schema"
        summary={`${seoFilled}/3 meta fields · ${plural(tab.faq?.length || 0, "FAQ")} · ${plural(tab.schemas?.length || 0, "schema")}`}
        hasError={
          !!(
            tabErrors.meta_title ||
            tabErrors.meta_description ||
            tabErrors.meta_keywords ||
            tabErrors.schemas ||
            tabErrors.faq
          )
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SeoFields prefix={prefix} idKey={country} />
            <SchemaFields prefix={prefix} />
          </div>
          <FaqFields name={`${prefix}faq`} />
        </div>
      </Section>
    </div>
  );
}

// Applications / Benefits: heading, short paragraph, features with an image
function ImageFeatureSection({
  icon,
  title,
  name,
  errors,
  imageFiles,
  onImageFile,
}) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.features`,
  });

  return (
    <Section
      icon={icon}
      title={title}
      summary={`${fields.length} item${fields.length === 1 ? "" : "s"}`}
      hasError={!!errors}
    >
      <HeadingFields prefix={`${name}.`} />

      <ListHeader
        label="Items"
        onAdd={() =>
          append({ uid: newUid(), heading: "", paragraph: "", img: "" })
        }
      >
        Add item
      </ListHeader>

      {fields.map((field, index) => {
        const err = errors?.features?.[index] || {};
        return (
          <Item
            key={field.id}
            index={index}
            onRemove={
              fields.length > 1
                ? () => {
                    onImageFile(field.uid, []);
                    remove(index);
                  }
                : null
            }
          >
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    {...register(`${name}.features.${index}.heading`)}
                    className={cn({ "border-red-500": err.heading })}
                    placeholder="Heading"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Paragraph</Label>
                  <Textarea
                    rows={3}
                    {...register(`${name}.features.${index}.paragraph`)}
                    className={cn({ "border-red-500": err.paragraph })}
                    placeholder="Description"
                  />
                </div>
              </div>
              <FeatureImage
                name={`${name}.features.${index}.img`}
                uid={field.uid}
                pending={imageFiles[field.uid]?.[0]}
                onImageFile={onImageFile}
              />
            </div>
          </Item>
        );
      })}
    </Section>
  );
}

// Saved image (with remove) + a newly picked one (sent on submit)
function FeatureImage({ name, uid, pending, onImageFile }) {
  const { watch, setValue } = useFormContext();
  const saved = watch(name);
  const mounted = useRef(false);
  // new key => empty uploader after the picked image is discarded
  const [uploaderKey, setUploaderKey] = useState(0);

  const pendingUrl = useMemo(
    () => (pending ? URL.createObjectURL(pending) : null),
    [pending],
  );
  useEffect(
    () => () => pendingUrl && URL.revokeObjectURL(pendingUrl),
    [pendingUrl],
  );

  const shown = pendingUrl || (saved ? fileUrl(saved) : null);

  return (
    <div className="space-y-2">
      <Label>Image</Label>

      {shown ? (
        <Thumb
          src={shown}
          label={pending ? "New" : null}
          onRemove={() => {
            if (pending) {
              onImageFile(uid, []);
              setUploaderKey((k) => k + 1);
            } else {
              setValue(name, "", { shouldDirty: true });
            }
          }}
        />
      ) : (
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <ImagePlus className="size-3.5" /> No image
        </p>
      )}

      <FileUpload
        key={uploaderKey}
        compact
        multiple={false}
        maxFiles={1}
        initialFiles={[]}
        onFileChange={(files) => {
          // the uploader reports [] when it mounts (e.g. switching tabs):
          // keep the image picked before
          if (!mounted.current) {
            mounted.current = true;
            if (!files.length) return;
          }
          onImageFile(uid, files);
        }}
      />
    </div>
  );
}

// Pictures of a tab: saved ones (removable) + new ones (sent on submit).
function TabPictures({ name, error, pending, onPending }) {
  const { watch, setValue } = useFormContext();
  const saved = watch(name) || [];

  // New pictures picked before this tab was opened (the uploader starts
  // empty on every mount); the uploader's own files are added to them.
  const [earlier, setEarlier] = useState(pending);
  const fromUploader = useRef([]);
  const mounted = useRef(false);

  const earlierUrls = useMemo(
    () => earlier.map((file) => URL.createObjectURL(file)),
    [earlier],
  );
  useEffect(
    () => () => earlierUrls.forEach((url) => URL.revokeObjectURL(url)),
    [earlierUrls],
  );

  const removeEarlier = (index) => {
    const next = earlier.filter((_, i) => i !== index);
    setEarlier(next);
    onPending([...next, ...fromUploader.current]);
  };

  return (
    <div className="space-y-3">
      {(saved.length > 0 || earlier.length > 0) && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
          {saved.map((src, index) => (
            <Thumb
              key={src}
              src={fileUrl(src)}
              label={index === 0 ? "Main" : null}
              onRemove={() =>
                setValue(
                  name,
                  saved.filter((p) => p !== src),
                  { shouldDirty: true },
                )
              }
            />
          ))}
          {earlierUrls.map((url, index) => (
            <Thumb
              key={url}
              src={url}
              label="New"
              onRemove={() => removeEarlier(index)}
            />
          ))}
        </div>
      )}

      <FileUpload
        multiple={true}
        maxFiles={50}
        initialFiles={[]}
        className={cn({ "border-red-500": error })}
        onFileChange={(files) => {
          // the uploader reports [] when it mounts: keep earlier pictures
          if (!mounted.current) {
            mounted.current = true;
            if (!files.length) return;
          }
          fromUploader.current = files;
          onPending([...earlier, ...files]);
        }}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Thumb({ src, label, onRemove }) {
  return (
    <div className="bg-accent relative aspect-square w-24 rounded-2xl border shadow-sm">
      <Image
        src={src}
        width={200}
        height={200}
        className="size-full rounded-[inherit] object-cover"
        alt="picture"
        unoptimized
      />
      {label && (
        <span className="bg-primary text-primary-foreground absolute bottom-1 left-1 rounded px-1.5 text-[10px] font-medium">
          {label}
        </span>
      )}
      <Button
        type="button"
        size="icon"
        aria-label="Remove image"
        className="border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
        onClick={onRemove}
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  );
}

// ================= Small layout pieces =================
// Collapsible card. Opens by itself when it has an error.
function Section({
  icon: Icon,
  title,
  summary,
  defaultOpen = false,
  hasError = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = open || hasError;

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <div
        className={cn(
          "bg-card rounded-[28px] border shadow transition-colors",
          hasError && "border-red-500/60",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-[28px] px-6 py-5 text-left"
          >
            {Icon && (
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full border",
                  hasError
                    ? "border-red-500/40 text-red-500"
                    : "text-foreground",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold">{title}</span>
              {summary && (
                <span className="text-muted-foreground block truncate text-xs">
                  {summary}
                </span>
              )}
            </span>
            {hasError && (
              <span className="text-xs font-medium text-red-500">
                Needs attention
              </span>
            )}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border">
              <ChevronDown
                className={cn(
                  "text-muted-foreground size-4 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 px-6 pt-1 pb-6">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function HeadingFields({ prefix }) {
  const { register } = useFormContext();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Section heading</Label>
        <Input {...register(`${prefix}heading`)} placeholder="Heading" />
      </div>
      <div className="space-y-2">
        <Label>Short paragraph</Label>
        <Textarea
          rows={2}
          {...register(`${prefix}short_paragraph`)}
          placeholder="Short paragraph under the heading"
        />
      </div>
    </div>
  );
}

function ListHeader({ label, onAdd, children }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <Label className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </Label>
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-full px-4"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        {children}
      </Button>
    </div>
  );
}

function Item({ index, onRemove, children }) {
  return (
    <div className="bg-muted/30 relative space-y-3 rounded-[20px] border p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex size-7 items-center justify-center rounded-full border text-xs font-medium">
          {index + 1}
        </span>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8 rounded-full border hover:text-red-500"
            onClick={onRemove}
            aria-label="Remove"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
