"use client";
// Shared by the product page, blog and custom page forms: site / country
// options and the SEO, FAQs & Schema fields.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { z } from "zod";

// Fields of one SEO block (used for Global SEO and every country SEO block)
export const seoFieldKeys = [
  "meta_title",
  "meta_description",
  "meta_keywords",
  "jsonld_schema",
];

// ================= Schema markup helpers =================
// Schemas are typed as plain JSON (no <script> tag). Any <script> tag pasted
// by mistake is removed before saving.
export const stripScriptTag = (value = "") =>
  value.replace(/<\/?script[^>]*>/gi, "").trim();

export const isValidSchemaJson = (value) => {
  const json = stripScriptTag(value);
  if (!json) return true; // empty boxes are ignored on save
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
};

export const schemaListSchema = z
  .array(
    z.object({
      value: z
        .string()
        .refine(
          isValidSchemaJson,
          "Invalid JSON. Paste only the JSON, without the <script> tag.",
        ),
    }),
  )
  .optional()
  .nullable();

// saved jsonld_schema (old text with <script> tags, JSON text, object or array)
// => form list [{ value }]
export function toSchemaList(raw) {
  if (raw === null || raw === undefined || raw === "") return [];

  if (typeof raw !== "string") {
    const list = Array.isArray(raw) ? raw : [raw];
    return list.map((item) => ({
      value: typeof item === "string" ? item : JSON.stringify(item, null, 2),
    }));
  }

  const scriptBlocks = [
    ...raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi),
  ]
    .map((match) => match[1].trim())
    .filter(Boolean);
  if (scriptBlocks.length) return scriptBlocks.map((value) => ({ value }));

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return toSchemaList(parsed);
    }
  } catch {}

  return raw.trim() ? [{ value: raw.trim() }] : [];
}

// form list [{ value }] => array of schema objects ("" when none)
export function fromSchemaList(list) {
  const schemas = (list || [])
    .map((item) => stripScriptTag(item?.value))
    .filter(Boolean)
    .map((json) => JSON.parse(json));

  return schemas.length ? schemas : "";
}

// Reusable meta block. prefix "" => top-level fields (blogs / custom pages),
// prefix "country_content.<country>." => a product country tab.
export function SeoFields({ prefix = "", label = "", idKey = "" }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = prefix
    ? prefix
        .split(".")
        .filter(Boolean)
        .reduce((acc, key) => acc?.[key], errors) || {}
    : errors || {};
  const withLabel = (text) => (label ? `${label} ${text}` : text);
  const idOf = (name) => (idKey ? `${idKey}_${name}` : name);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={idOf("meta_title")}>{withLabel("Meta title")}</Label>
        <Input
          id={idOf("meta_title")}
          {...register(`${prefix}meta_title`)}
          className={cn({ "border-red-500": fieldErrors.meta_title })}
          placeholder={`Enter ${label ? label + " " : ""}meta title`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={idOf("meta_description")}>
          {withLabel("Meta description")}
        </Label>
        <Textarea
          id={idOf("meta_description")}
          {...register(`${prefix}meta_description`)}
          className={cn({ "border-red-500": fieldErrors.meta_description })}
          placeholder={`Enter ${label ? label + " " : ""}meta description`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={idOf("meta_keywords")}>
          {withLabel("Meta keywords")}
        </Label>
        <Textarea
          id={idOf("meta_keywords")}
          {...register(`${prefix}meta_keywords`)}
          className={cn({ "border-red-500": fieldErrors.meta_keywords })}
          placeholder={`Enter ${label ? label + " " : ""}meta keywords`}
        />
      </div>
    </div>
  );
}

// Multiple schema markups (form field `<prefix>schemas`, saved as jsonld_schema).
export function SchemaFields({ prefix = "", label = "", hint = "" }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const name = `${prefix}schemas`;
  const { fields, append, remove } = useFieldArray({ control, name });
  const schemaErrors = name
    .split(".")
    .reduce((acc, key) => acc?.[key], errors);

  return (
    <div className="space-y-3">
      <div>
        <Label>{label ? `${label} Schema Markup` : "Schema Markup"}</Label>
        <p className="text-muted-foreground text-xs">
          Paste only the JSON (starting with {"{"}), no {"<script>"} tag
          needed. Add one box per schema.{hint ? ` ${hint}` : ""}
        </p>
      </div>

      {fields.map((field, ind) => (
        <div key={field.id} className="relative rounded-xl border p-3">
          <Button
            type="button"
            onClick={() => remove(ind)}
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
          >
            <Trash2 />
          </Button>
          <Label className="mb-2 block">Schema {ind + 1}</Label>
          <Textarea
            {...register(`${name}.${ind}.value`)}
            className={cn("h-48 font-mono text-xs", {
              "border-red-500": schemaErrors?.[ind]?.value,
            })}
            placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "..."\n}'}
          />
          {schemaErrors?.[ind]?.value && (
            <span className="text-xs text-red-500">
              {schemaErrors[ind].value.message}
            </span>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append({ value: "" })}
      >
        <Plus /> Add Schema
      </Button>
    </div>
  );
}

// FAQ list. name "faq" (blogs / pages) or "country_content.<country>.faq".
export function FaqFields({ name, label = "", hint = "" }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const faqErrors = name.split(".").reduce((acc, key) => acc?.[key], errors);

  return (
    <div className="space-y-3">
      <div>
        <Label>{label ? `${label} FAQs` : "FAQs"}</Label>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </div>

      {fields.map((field, ind) => (
        <div key={field.id} className="relative space-y-2 rounded-xl border p-3">
          <Button
            type="button"
            onClick={() => remove(ind)}
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
          >
            <Trash2 />
          </Button>
          <div className="space-y-1">
            <Label>Question*</Label>
            <Input
              {...register(`${name}.${ind}.q`)}
              className={cn({ "border-red-500": faqErrors?.[ind]?.q })}
              placeholder="Question"
            />
            {faqErrors?.[ind]?.q && (
              <span className="text-xs text-red-500">
                {faqErrors[ind].q.message}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <Label>Answer*</Label>
            <Textarea
              {...register(`${name}.${ind}.a`)}
              className={cn({ "border-red-500": faqErrors?.[ind]?.a })}
              placeholder="Answer"
            />
            {faqErrors?.[ind]?.a && (
              <span className="text-xs text-red-500">
                {faqErrors[ind].a.message}
              </span>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append({ q: "", a: "" })}
      >
        <Plus /> Add FAQ
      </Button>
    </div>
  );
}

// SEO, FAQs & Schema of a blog / custom page (one site per item).
export function SeoSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-semibold">SEO, FAQs & Schema</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SeoFields />
          <SchemaFields />
        </div>
        <FaqFields name="faq" />
      </div>
    </div>
  );
}

// ================= Sites / countries =================
// "Global" = the main site (no URL prefix). Chosen like a country; an item
// without Global is not shown on the main site.
export const GLOBAL_COUNTRY = "Global";

// Countries that have a website (/in, /au, /za ...). The value is saved in
// the DB and must match exactly:
//   - client/web/src/utils/country-mapping.js (COUNTRIES[].name)
//   - server/app/helpers/country-seo.js (COUNTRIES[].name)
// Do not rename a value (e.g. "UAE") — saved products/blogs use it.
export const websiteCountryOptions = [
  { label: "India", value: "India" },
  { label: "Australia", value: "Australia" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "UAE", value: "UAE" },
  { label: "South Africa", value: "South Africa" },
  { label: "Egypt", value: "Egypt" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Morocco", value: "Morocco" },
  { label: "Algeria", value: "Algeria" },
  { label: "Kenya", value: "Kenya" },
  { label: "Tanzania", value: "Tanzania" },
];

// Live website + URL prefix of every site (same codes as the website).
export const WEBSITE_URL = "https://www.duraplastindia.com";
export const SITE_LOCALES = {
  India: "in",
  Australia: "au",
  "New Zealand": "nz",
  "United States": "us",
  "United Kingdom": "gb",
  UAE: "ae",
  "South Africa": "za",
  Egypt: "eg",
  Nigeria: "ng",
  Morocco: "ma",
  Algeria: "dz",
  Kenya: "ke",
  Tanzania: "tz",
};

// Live URL of a product on a site ("Global" = main site, no prefix).
export const productUrl = (country, slug) =>
  `${WEBSITE_URL}${
    country === GLOBAL_COUNTRY || !SITE_LOCALES[country]
      ? ""
      : `/${SITE_LOCALES[country]}`
  }/product/${slug}`;

// Options of the country pickers: Global + every country with a website.
export const siteOptions = [
  { label: "Global (main site)", value: GLOBAL_COUNTRY },
  ...websiteCountryOptions,
];

// Picker options for an item: every site + any other country already saved
// on it (e.g. "Canada"), so the form shows exactly what is in the database.
export const withSavedOptions = (saved = []) => [
  ...siteOptions,
  ...[...new Set(Array.isArray(saved) ? saved : [saved])]
    .filter((c) => c && !siteOptions.some((o) => o.value === c))
    .map((c) => ({ label: c, value: c })),
];

// Old, wider list (countries without a website). Not used by the forms.
export const cityOptions = [
  ...websiteCountryOptions,
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
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Qatar", value: "Qatar" },
  { label: "Oman", value: "Oman" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Bahrain", value: "Bahrain" },
  { label: "Brazil", value: "Brazil" },
  { label: "Mexico", value: "Mexico" },
  { label: "Argentina", value: "Argentina" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Nepal", value: "Nepal" },
  { label: "Pakistan", value: "Pakistan" },
];

// ================= Shared form <-> API helpers =================

// FAQ list [{ q, a }]
export const faqListSchema = z
  .array(
    z.object({
      q: z.string().trim().min(3, "Question must be atleast 3 characters long."),
      a: z.string().trim().min(3, "Answer must be atleast 3 characters long."),
    }),
  )
  .optional()
  .nullable();

// API record => form values (schema boxes)
export function toSeoFormValues(data) {
  return { schemas: toSchemaList(data?.jsonld_schema) };
}

// Form values => API payload (mutates data): schema boxes => jsonld_schema.
export function applySeoPayload(data) {
  data.jsonld_schema = fromSchemaList(data.schemas);
  delete data.schemas;
  delete data.country_seo; // old country-wise SEO, no longer used
  return data;
}
