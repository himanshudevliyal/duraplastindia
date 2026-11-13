"use client";
// Country languages + the master language list.
// URLs: default language => /<country>/about (no code),
//       other languages  => /<country>/<code>/about.
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/loader";
import ErrorMessage from "@/components/ui/error";
import CustomCommandMenu from "@/components/custom-command-menu";
import { cn } from "@/lib/utils";
import {
  SITE_LOCALES,
  websiteCountryOptions,
} from "@/components/forms/seo-tabs";
import {
  useCountryLanguages,
  useCreateLanguage,
  useDeleteLanguage,
  useLanguages,
  useSaveCountryLanguages,
  useUpdateLanguage,
} from "@/hooks/use-languages";

export default function LanguagesManager() {
  return (
    <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
      <CountryLanguages />
      <LanguageList />
    </div>
  );
}

// ================= languages of one country =================
function CountryLanguages() {
  const languagesQuery = useLanguages();
  const countriesQuery = useCountryLanguages();
  const [country, setCountry] = useState(websiteCountryOptions[0].value);
  // { [code]: { selected, enabled } } + default code
  const [rows, setRows] = useState({});
  const [defaultCode, setDefaultCode] = useState("en");

  const saved = useMemo(
    () => countriesQuery.data?.find((c) => c.country === country),
    [countriesQuery.data, country],
  );

  // load the saved setup of the selected country
  useEffect(() => {
    if (!saved) return;
    setRows(
      Object.fromEntries(
        saved.languages.map((l) => [l.code, { selected: true, enabled: l.enabled }]),
      ),
    );
    setDefaultCode(saved.default);
  }, [saved]);

  const save = useSaveCountryLanguages(() =>
    toast.success(`${country} languages saved.`),
  );

  if (languagesQuery.isLoading || countriesQuery.isLoading) return <Loader />;
  if (languagesQuery.isError)
    return <ErrorMessage error={languagesQuery.error} />;
  if (countriesQuery.isError)
    return <ErrorMessage error={countriesQuery.error} />;

  // disabled languages are only listed when this country already uses them
  const languages = (languagesQuery.data ?? []).filter(
    (l) => l.enabled || rows[l.code]?.selected,
  );
  const prefix = `/${SITE_LOCALES[country] ?? "xx"}`;
  const selectedCodes = Object.keys(rows).filter((c) => rows[c].selected);

  const toggle = (code, selected) => {
    if (!selected && code === defaultCode) {
      toast.warning("Choose another default language first.");
      return;
    }
    setRows((prev) => ({
      ...prev,
      [code]: { selected, enabled: prev[code]?.enabled ?? true },
    }));
  };

  const setLive = (code, enabled) =>
    setRows((prev) => ({ ...prev, [code]: { ...prev[code], enabled } }));

  const makeDefault = (code) => {
    setDefaultCode(code);
    setRows((prev) => ({
      ...prev,
      [code]: { selected: true, enabled: true },
    }));
  };

  const onSave = () =>
    save.mutate({
      country,
      default: defaultCode,
      languages: selectedCodes.map((code) => ({
        code,
        enabled: code === defaultCode ? true : rows[code].enabled !== false,
      })),
    });

  return (
    <div className="bg-card space-y-5 rounded-[28px] border p-6 shadow">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Country languages</h3>
        <p className="text-muted-foreground text-sm">
          Pick a country, tick its languages and choose the default. The
          default language has no code in the URL.
        </p>
      </div>

      <div className="max-w-sm space-y-2">
        <Label>Country</Label>
        <CustomCommandMenu
          data={websiteCountryOptions}
          searchPlaceholder="Search country"
          value={country}
          onChange={(value) => value && setCountry(value)}
        />
      </div>

      <div className="divide-y rounded-2xl border">
        {languages.map((language) => {
          const row = rows[language.code];
          const selected = !!row?.selected;
          const isDefault = language.code === defaultCode;
          return (
            <div
              key={language.code}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
                !selected && "opacity-70",
              )}
            >
              <label className="flex min-w-[220px] flex-1 cursor-pointer items-center gap-3">
                <Checkbox
                  checked={selected}
                  onCheckedChange={(v) => toggle(language.code, !!v)}
                />
                <span className="font-medium">
                  {language.name}{" "}
                  <span className="text-muted-foreground">({language.code})</span>
                </span>
                {language.native_name && language.native_name !== language.name && (
                  <span className="text-muted-foreground text-sm">
                    {language.native_name}
                  </span>
                )}
              </label>

              {selected && (
                <>
                  <code className="text-muted-foreground text-xs">
                    {isDefault ? `${prefix}/about` : `${prefix}/${language.code}/about`}
                  </code>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="default-language"
                      checked={isDefault}
                      onChange={() => makeDefault(language.code)}
                    />
                    Default
                  </label>

                  <label
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      isDefault && "pointer-events-none opacity-50",
                    )}
                  >
                    <Switch
                      checked={isDefault || row.enabled !== false}
                      onCheckedChange={(v) => setLive(language.code, v)}
                      disabled={isDefault}
                    />
                    Live
                  </label>
                </>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground text-xs">
        A language that is ticked but not Live is kept for this country but is
        not shown on the website yet (e.g. while its content is being written).
      </p>

      <div className="text-end">
        <Button onClick={onSave} disabled={save.isPending || !selectedCodes.length}>
          {save.isPending && <Loader2 className="animate-spin" />} Save {country}
        </Button>
      </div>
    </div>
  );
}

// ================= master list =================
const emptyForm = { code: "", name: "", native_name: "" };

function LanguageList() {
  const { data, isLoading, isError, error } = useLanguages();
  const countriesQuery = useCountryLanguages();
  const [form, setForm] = useState(emptyForm);

  const create = useCreateLanguage(() => {
    toast.success("Language added.");
    setForm(emptyForm);
  });
  const update = useUpdateLanguage(() => toast.success("Language updated."));
  const remove = useDeleteLanguage(() => toast.success("Language deleted."));

  // countries using a language (shown under each language)
  const usage = useMemo(() => {
    const map = {};
    (countriesQuery.data ?? []).forEach(({ country, languages }) =>
      languages.forEach(({ code, is_default }) => {
        (map[code] ??= []).push({ country, is_default });
      }),
    );
    return map;
  }, [countriesQuery.data]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;

  const onAdd = (e) => {
    e.preventDefault();
    const code = form.code.trim().toLowerCase();
    if (!/^[a-z]{2,3}$/.test(code)) {
      toast.warning("Use the ISO language code, e.g. hi, fr, sw.");
      return;
    }
    if (!form.name.trim()) {
      toast.warning("Name is required.");
      return;
    }
    create.mutate({ ...form, code });
  };

  return (
    <div className="bg-card space-y-5 rounded-[28px] border p-6 shadow">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">All languages</h3>
        <p className="text-muted-foreground text-sm">
          Languages that can be added to a country. A disabled language is
          hidden everywhere.
        </p>
      </div>

      <form onSubmit={onAdd} className="grid gap-2 sm:grid-cols-[90px_1fr_1fr_auto]">
        <Input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="Code"
          maxLength={3}
        />
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name (e.g. Hindi)"
        />
        <Input
          value={form.native_name}
          onChange={(e) => setForm({ ...form, native_name: e.target.value })}
          placeholder="Native name (e.g. हिन्दी)"
        />
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />} Add
        </Button>
      </form>

      <div className="divide-y rounded-2xl border">
        {(data ?? []).map((language) => {
          const used = usage[language.code] ?? [];
          const defaultIn = used.filter((u) => u.is_default).map((u) => u.country);
          return (
            <div key={language.code} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {language.name}{" "}
                  <span className="text-muted-foreground">({language.code})</span>
                  {language.native_name && language.native_name !== language.name && (
                    <span className="text-muted-foreground ml-2 text-sm">
                      {language.native_name}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {used.length ? (
                    <>
                      {defaultIn.length > 0 && (
                        <Star className="mr-1 inline size-3 fill-current" />
                      )}
                      {used.map((u) => u.country).join(", ")}
                    </>
                  ) : (
                    "Not used by any country"
                  )}
                </p>
              </div>

              <Switch
                checked={language.enabled}
                onCheckedChange={(enabled) =>
                  update.mutate({ code: language.code, enabled })
                }
                aria-label={`${language.name} enabled`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={defaultIn.length > 0 || remove.isPending}
                title={
                  defaultIn.length
                    ? `Default language of ${defaultIn.join(", ")}`
                    : "Delete"
                }
                onClick={() => {
                  const warn = used.length
                    ? ` It is also removed from ${used.map((u) => u.country).join(", ")}.`
                    : "";
                  if (window.confirm(`Delete ${language.name}?${warn}`)) {
                    remove.mutate(language.code);
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
