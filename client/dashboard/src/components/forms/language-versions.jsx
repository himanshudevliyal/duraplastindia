"use client";
// Language versions of a blog / solution / custom page / product tab /
// category tab — e.g. French on /ma/fr/... . The languages come from
// Dashboard > Languages (the country's languages except its default one).
// A version is saved only when its title is filled; empty fields use the
// main (default language) content.
//
// Form values live at `<prefix><lang>.*` (prefix e.g. "translations." or
// "country_content.Morocco.translations."). Use toVersionsForm /
// fromVersionsForm to convert between the API and the form.
import { useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { Languages, Plus, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import TextEditor from "../editor";
import { cn } from "@/lib/utils";
import { useCountryLanguages, useLanguages } from "@/hooks/use-languages";
import CustomMultiSelect from "../custom-multi-select";
import Link from "next/link";
import {
  FaqFields,
  SchemaFields,
  SITE_LOCALES,
  SeoFields,
  WEBSITE_URL,
  fromSchemaList,
  toSchemaList,
} from "./seo-tabs";

// ================= data helpers =================
const toSlugInput = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // é => e
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");
const toSlug = (value = "") => toSlugInput(value).replace(/-+$/g, "");

// loose: every field is optional; the server cleans the versions
export const versionsSchema = z.record(z.string(), z.any()).optional();

// API translations => form values (schema boxes)
export const toVersionsForm = (translations) =>
  Object.fromEntries(
    Object.entries(translations || {}).map(([lang, { jsonld_schema, ...v }]) => [
      lang,
      { ...v, schemas: toSchemaList(jsonld_schema) },
    ]),
  );

// form values => API translations (versions without a title are dropped)
export const fromVersionsForm = (versions) =>
  Object.fromEntries(
    Object.entries(versions || {})
      // picked languages are kept even before their title is filled (a
      // version without a title is not shown on the website)
      .filter(([, v]) => v && typeof v === "object")
      .map(([lang, { schemas, ...v }]) => [
        lang,
        {
          ...v,
          slug: toSlug(v.slug || v.title),
          jsonld_schema: fromSchemaList(schemas),
          faq: (v.faq || []).filter((f) => f?.q?.trim() && f?.a?.trim()),
        },
      ]),
  );

// ================= languages of a page =================
// Every page picks its own languages from its country's languages (Dashboard
// > Languages), e.g. one India blog in Hindi + Punjabi, another in Hindi +
// Marathi + Bhojpuri. The picked languages are the keys of the form's
// translations object (`<prefix><lang>`); only they get a tab, any other
// language URL of the page is a 404.

const fieldOf = (prefix) => (prefix.endsWith(".") ? prefix.slice(0, -1) : prefix);

// languages, labels and this page's picked languages
function usePageLanguages(country, prefix) {
  const { data: allLanguages, isLoading } = useLanguages();
  const { data: countries } = useCountryLanguages();
  const { watch } = useFormContext();

  const versions = watch(fieldOf(prefix)) || {};
  const entry = countries?.find((c) => c.country === country);
  const defaultCode = entry?.default ?? "en";
  const codes = Object.keys(versions).filter((c) => c !== defaultCode);

  const byCode = Object.fromEntries((allLanguages ?? []).map((l) => [l.code, l]));
  const labelOf = (code) => {
    const l = byCode[code];
    if (!l) return code;
    return l.native_name && l.native_name !== l.name
      ? `${l.name} (${l.native_name})`
      : l.name;
  };
  // this country's languages (+ any already used by this page)
  const countryCodes = (entry?.languages ?? [])
    .filter((l) => !l.is_default && l.language_enabled)
    .map((l) => l.code);

  return {
    ready: !!country && !isLoading && !!allLanguages,
    codes,
    byCode,
    labelOf,
    options: [...new Set([...countryCodes, ...codes])].map((code) => ({
      value: code,
      label: `${labelOf(code)} · ${code}`,
    })),
  };
}

// Multi-select of this page's languages (shown next to the country field).
// Picking adds an empty version (its tab appears below); removing deletes it.
export function LanguagePicker({
  country,
  prefix = "translations.",
  label = "Languages",
}) {
  const { getValues, setValue } = useFormContext();
  const { ready, codes, options, labelOf } = usePageLanguages(country, prefix);
  const field = fieldOf(prefix);

  const onPick = (selected = []) => {
    const next = selected.map((o) => o.value);
    const removed = codes.filter((c) => !next.includes(c));
    if (
      removed.length &&
      !window.confirm(
        `Remove the ${removed.map(labelOf).join(", ")} version of this page? Its texts are deleted when you save.`,
      )
    ) {
      return;
    }
    const current = { ...(getValues(field) || {}) };
    removed.forEach((c) => delete current[c]);
    next.forEach((c) => {
      if (!current[c]) current[c] = { title: "", slug: "", schemas: [], faq: [] };
    });
    setValue(field, current, { shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {ready ? (
        <CustomMultiSelect
          options={options}
          value={codes.map((code) => ({
            value: code,
            label: `${labelOf(code)} · ${code}`,
          }))}
          onChange={onPick}
          placeholder="Other languages (optional)"
        />
      ) : (
        <div className="text-muted-foreground flex h-10 items-center rounded-md border px-3 text-sm">
          {country ? "Loading…" : "Select a country first"}
        </div>
      )}
      <p className="text-muted-foreground text-xs">
        {country && ready && !options.length
          ? `${country === "Global" ? "The main site" : country} has no other languages. `
          : "English is the main content. "}
        <Link href="/languages" className="underline">
          Country languages
        </Link>
      </p>
    </div>
  );
}

// Tabs with the content of every picked language.
// withPicker: also show the picker on top (product / category tabs).
// kind: "page" (blog / solution / custom page), "product", "category"
// urlFor(lang, slug): live URL of a version (optional)
export function LanguageVersions({
  country,
  prefix,
  kind = "page",
  urlFor,
  withPicker = false,
}) {
  const { watch } = useFormContext();
  const [active, setActive] = useState(null);
  const { ready, codes, byCode } = usePageLanguages(country, prefix);

  if (!ready) return null;
  if (!codes.length && !withPicker) return null;

  const current = codes.includes(active) ? active : codes[0];

  return (
    <div className="bg-card space-y-4 rounded-[24px] border p-6 shadow">
      <div className="flex items-start gap-3">
        <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
          <Languages className="size-4" />
        </span>
        <div>
          <h4 className="font-semibold">Language versions</h4>
          <p className="text-muted-foreground text-sm">
            Content of the other languages of this page. Fill the title to
            publish a version; empty fields use the main content.
          </p>
        </div>
      </div>

      {withPicker && (
        <LanguagePicker
          country={country}
          prefix={prefix}
          label="Languages of this page"
        />
      )}

      {codes.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {codes.map((code) => {
              const filled = !!watch(`${prefix}${code}.title`)?.trim();
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setActive(code)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    code === current
                      ? "bg-brand border-transparent shadow"
                      : "hover:bg-muted text-muted-foreground",
                  )}
                >
                  {byCode[code]?.native_name || byCode[code]?.name || code}
                  <span className="text-xs uppercase opacity-70">{code}</span>
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      filled ? "bg-green-500" : "bg-gray-300",
                    )}
                    title={filled ? "Version filled" : "Title not filled yet"}
                  />
                </button>
              );
            })}
          </div>

          {current && (
            <VersionFields
              key={current}
              prefix={`${prefix}${current}.`}
              lang={current}
              kind={kind}
              urlFor={urlFor}
            />
          )}
        </>
      )}
    </div>
  );
}

// fields of one language version
function VersionFields({ prefix, lang, kind, urlFor }) {
  const { register, control, setValue, getValues, watch } = useFormContext();
  const slug = watch(`${prefix}slug`);
  const title = watch(`${prefix}title`);
  const url = urlFor && title?.trim() ? urlFor(lang, toSlug(slug || title)) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Title ({lang.toUpperCase()})</Label>
          <Input
            {...register(`${prefix}title`, {
              onBlur: (e) => {
                if (kind !== "category" && !getValues(`${prefix}slug`)) {
                  setValue(`${prefix}slug`, toSlug(e.target.value));
                }
              },
            })}
            placeholder="Empty = no version in this language"
          />
        </div>

        {kind === "category" ? (
          <div className="space-y-2">
            <Label>H1 ({lang.toUpperCase()})</Label>
            <Input {...register(`${prefix}h1`)} placeholder="Title is used when empty" />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>URL slug ({lang.toUpperCase()})</Label>
            <Input
              {...register(`${prefix}slug`, {
                onChange: (e) => setValue(`${prefix}slug`, toSlugInput(e.target.value)),
                onBlur: (e) => setValue(`${prefix}slug`, toSlug(e.target.value)),
              })}
              placeholder="e.g. lanterneaux-pour-panneaux-sandwich"
            />
            {url && (
              <p className="text-muted-foreground text-xs break-all">{url}</p>
            )}
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea {...register(`${prefix}description`)} rows={3} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Content</Label>
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

      {kind === "product" && <ProductSections prefix={prefix} />}

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SeoFields prefix={prefix} idKey={`${prefix.replace(/\W+/g, "_")}`} />
          <SchemaFields prefix={prefix} />
        </div>
        <FaqFields name={`${prefix}faq`} />
      </div>
    </div>
  );
}

// ================= product sections (text only) =================
// Pictures / feature images come from the country tab: feature N of a
// version shows the image of feature N of the country tab.
function ProductSections({ prefix }) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <Separator />
      <div className="space-y-2">
        <Label>Overview heading</Label>
        <Input {...register(`${prefix}overview.heading`)} />
      </div>
      <TextList
        name={`${prefix}overview.paragraphs`}
        label="Overview paragraphs"
      />

      <SectionText
        prefix={`${prefix}why_choose.`}
        title="Why Choose"
        itemText="short_paragraph"
      />
      <SectionText
        prefix={`${prefix}applications.`}
        title="Applications"
        itemText="paragraph"
      />
      <SectionText
        prefix={`${prefix}benefits.`}
        title="Benefits"
        itemText="paragraph"
      />
    </div>
  );
}

// list of plain strings
function TextList({ name, label }) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="secondary" size="sm" onClick={() => append("")}>
          <Plus /> Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Textarea rows={3} {...register(`${name}.${index}`)} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// heading + short paragraph + features (heading, text)
function SectionText({ prefix, title, itemText }) {
  const { register, control } = useFormContext();
  const name = `${prefix}features`;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <p className="font-medium">{title}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Input {...register(`${prefix}heading`)} placeholder="Heading" />
        <Textarea
          rows={2}
          {...register(`${prefix}short_paragraph`)}
          placeholder="Short paragraph"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Features (same order as the country tab)</Label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ heading: "", [itemText]: "" })}
        >
          <Plus /> Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
          <Input {...register(`${name}.${index}.heading`)} placeholder={`Feature ${index + 1} heading`} />
          <Textarea rows={2} {...register(`${name}.${index}.${itemText}`)} placeholder="Text" />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// ================= single-site items (blog / solution / custom page) =================
// The country comes from the form's `city` field (one site per item).
// The language picker sits next to the country field
// (<PageLanguagePicker />); this shows the tabs of the picked languages.
// path: URL part before the slug ("blog", "solutions", "" for custom pages).
export function PageLanguageVersions({ path = "" }) {
  const { watch } = useFormContext();
  const country = watch("city");
  const site = Array.isArray(country) ? country[0] : country;

  return (
    <LanguageVersions
      country={site}
      prefix="translations."
      kind="page"
      urlFor={(lang, slug) =>
        `${WEBSITE_URL}${
          site && SITE_LOCALES[site] ? `/${SITE_LOCALES[site]}` : ""
        }/${lang}${path ? `/${path}` : ""}/${slug}`
      }
    />
  );
}

// language picker of a single-site item, next to its country field
export function PageLanguagePicker() {
  const { watch } = useFormContext();
  const country = watch("city");
  const site = Array.isArray(country) ? country[0] : country;
  return <LanguagePicker country={site} prefix="translations." />;
}
