"use client";
// Shared by the product page and blog forms: country list and the
// "SEO, FAQs & Schema" tabs (Global + one tab per selected country).
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
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

// Reusable meta block. prefix "" => Global SEO (existing field names),
// prefix "country_seo.<country>." => country-specific SEO.
export function SeoFields({ prefix = "", label = "", idKey = "" }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = prefix
    ? errors?.country_seo?.[idKey] || {}
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

// FAQ list. name "faq" => global FAQs, "country_seo.<country>.faq" => country FAQs.
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

// Tabs: Global + one per selected country. Only the active tab's fields are shown.
export function SeoTabs({ countries }) {
  const {
    formState: { errors },
  } = useFormContext();
  const [activeTab, setActiveTab] = useState("global");

  // fall back to Global when the active country is removed
  const active = countries.some((c) => c.value === activeTab)
    ? activeTab
    : "global";

  const tabs = [{ value: "global", label: "Global" }, ...countries];

  const hasError = (tab) =>
    tab === "global"
      ? ["meta_title", "meta_description", "meta_keywords", "schemas", "faq"]
          .some((key) => errors?.[key])
      : !!errors?.country_seo?.[tab];

  const activeCountry = countries.find((c) => c.value === active);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-3xl font-semibold">SEO, FAQs & Schema</h3>
        <p className="text-muted-foreground text-sm">
          Global is used on the main site and for any country field left
          empty. Select countries above to get their tabs.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              active === tab.value
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
            {hasError(tab.value) && (
              <span className="size-2 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {active === "global" ? (
        <div key="global" className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SeoFields />
            <SchemaFields />
          </div>
          <FaqFields name="faq" />
        </div>
      ) : (
        <div key={active} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SeoFields
              prefix={`country_seo.${active}.`}
              label={activeCountry.label}
              idKey={active}
            />
            <SchemaFields
              prefix={`country_seo.${active}.`}
              label={activeCountry.label}
              hint="Leave empty to use the Global schemas."
            />
          </div>
          <FaqFields
            name={`country_seo.${active}.faq`}
            label={activeCountry.label}
            hint={`Leave empty to show the Global FAQs for ${activeCountry.label}.`}
          />
        </div>
      )}
    </div>
  );
}

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

// country_seo: { [country]: { meta_title, meta_description, meta_keywords, jsonld_schema, schemas, faq } }
export const countrySeoSchema = z
  .record(
    z.string(),
    z.object({
      meta_title: z.string().optional().nullable(),
      meta_description: z.string().optional().nullable(),
      meta_keywords: z.string().optional().nullable(),
      jsonld_schema: z.any().optional().nullable(),
      schemas: schemaListSchema,
      faq: faqListSchema,
    }),
  )
  .optional()
  .nullable();

// API record => form values (schema boxes for Global and every country)
export function toSeoFormValues(data) {
  return {
    schemas: toSchemaList(data?.jsonld_schema),
    country_seo: Object.fromEntries(
      Object.entries(data?.country_seo || {}).map(([country, seo]) => [
        country,
        { ...seo, schemas: toSchemaList(seo?.jsonld_schema) },
      ]),
    ),
  };
}

// Form values => API payload (mutates data). `countries` = selected country values.
// Country blocks are sent only for selected countries and only when not empty.
export function applySeoPayload(data, countries = []) {
  data.jsonld_schema = fromSchemaList(data.schemas);
  delete data.schemas;

  data.country_seo = Object.fromEntries(
    Object.entries(data.country_seo || {})
      .map(([country, { schemas, ...seo }]) => {
        const jsonld = fromSchemaList(schemas);
        if (jsonld) seo.jsonld_schema = jsonld;
        else delete seo.jsonld_schema;
        return [country, seo];
      })
      .filter(
        ([country, seo]) =>
          countries.includes(country) &&
          (seoFieldKeys.some((key) => seo?.[key]?.toString().trim()) ||
            seo?.faq?.length),
      ),
  );

  return data;
}
