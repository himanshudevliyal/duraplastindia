"use client";

import { useMemo, useState } from "react";
import { Fraunces, Inter } from "next/font/google";
import { useChannelPartners } from "@/hooks/channel-partner";
import { Toast } from "radix-ui";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Building2,
  Globe2,
  X,
  Calendar,
  ExternalLink,
  Compass,
  ChevronRight,
} from "lucide-react";

// Returns a clean 2-letter ISO country code for display, or null if the
// source value is malformed (some rows in the data have bad codes). Flag
// emoji was tried here but Windows renders those as plain letter pairs
// instead of a flag, so a small code chip is used instead — consistent
// on every OS.
function isoCode(iso) {
  if (!iso || typeof iso !== "string") return null;
  const code = iso.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

export default function DistributorDirectory() {
  const { data: rawData, isLoading, isError, error } = useChannelPartners();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState(null);

  const partners = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData?.data?.partners)) return rawData.data.partners;
    if (Array.isArray(rawData?.partners)) return rawData.partners;
    if (Array.isArray(rawData?.data)) return rawData.data;
    return [];
  }, [rawData]);

  const regions = useMemo(() => {
    const unique = Array.from(
      new Set(partners.map((d) => d.region).filter(Boolean)),
    );
    return ["All", ...unique.sort()];
  }, [partners]);

  const filtered = useMemo(() => {
    return partners.filter((d) => {
      const matchesRegion = region === "All" || d.region === region;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        d.country?.toLowerCase().includes(q) ||
        d.company?.toLowerCase().includes(q) ||
        d.region?.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [partners, query, region]);

  return (
    <div className={` dd-root`}>
      <style>{`
        .dd-root {
          --dd-bg: #fbfafa;
          --dd-surface: #ffffff;
          --dd-ink: #241a1c;
          --dd-muted: #8a7a7c;
          --dd-border: #f1dbdd;
          --dd-primary: #c8102e;
          --dd-primary-dark: #8f0c20;
          --dd-primary-soft: #fbe4e7;
          --dd-accent: #a10d24;
          --dd-accent-soft: #fbe4e7;
          --dd-shadow-rgb: 60, 20, 24;
          font-family: var(--dd-font-body), system-ui, sans-serif;
          background: var(--dd-bg);
          color: var(--dd-ink);
          min-height: 100vh;
        }
        .dd-root .dd-serif { font-family: var(--dd-font-display), Georgia, serif; }
        .dd-btn-reset { appearance: none; border: none; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
        .dd-iso-chip {
          font-family: var(--dd-font-body), monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--dd-primary);
          background: var(--dd-primary-soft);
          border: 1px solid var(--dd-border);
          border-radius: 5px;
          padding: 2px 5px;
          line-height: 1.2;
        }
        .dd-card {
          background: var(--dd-surface);
          border: 1px solid var(--dd-border);
          box-shadow: 0 1px 2px rgba(var(--dd-shadow-rgb), 0.04);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .dd-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -8px rgba(var(--dd-shadow-rgb), 0.18);
          border-color: var(--dd-primary);
        }
        .dd-stamp {
          border: 1.5px solid var(--dd-accent);
          outline: 1.5px dashed var(--dd-accent);
          outline-offset: 2px;
          color: var(--dd-accent);
          background: var(--dd-accent-soft);
          transform: rotate(-3deg);
          font-family: var(--dd-font-display), Georgia, serif;
          letter-spacing: 0.04em;
        }
        .dd-pill {
          border: 1px solid var(--dd-border);
          color: var(--dd-muted);
          background: var(--dd-surface);
          transition: all 0.15s ease;
        }
        .dd-pill[data-active="true"] {
          background: var(--dd-primary);
          border-color: var(--dd-primary);
          color: #fff;
        }
        .dd-pill:not([data-active="true"]):hover {
          border-color: var(--dd-primary);
          color: var(--dd-primary);
        }
        .dd-search:focus { outline: none; border-color: var(--dd-primary); box-shadow: 0 0 0 3px var(--dd-primary-soft); }
        .dd-modal-backdrop { background: rgba(15, 20, 26, 0.55); backdrop-filter: blur(3px); }
        .dd-modal { box-shadow: 0 30px 60px -15px rgba(var(--dd-shadow-rgb), 0.35); }
        .dd-row { border: 1px solid var(--dd-border); transition: border-color 0.15s ease; }
        .dd-row:hover { border-color: var(--dd-primary); }
        @keyframes dd-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dd-slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .dd-anim-fade { animation: dd-fade-in 0.15s ease; }
        .dd-anim-slide { animation: dd-slide-up 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (prefers-reduced-motion: reduce) {
          .dd-card, .dd-anim-fade, .dd-anim-slide { animation: none !important; transition: none !important; }
        }
        .dd-map-wrap iframe { width: 100%; height: 100%; display: block; border: 0; }
      `}</style>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} />
      ) : (
        <>
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(120deg, var(--dd-primary), var(--dd-primary-dark))`,
            }}
          ></div>

          {/* Filters */}
          <div
            className="sticky top-0 z-10"
            style={{
              background: "var(--dd-bg)",
              borderBottom: "1px solid var(--dd-border)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--dd-muted)" }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by country, company or region..."
                  className="dd-search w-full pl-9 pr-3 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "var(--dd-surface)",
                    border: "1px solid var(--dd-border)",
                  }}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    data-active={region === r}
                    className="dd-btn-reset dd-pill shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {filtered.length === 0 ? (
              <div
                className="text-center py-16"
                style={{ color: "var(--dd-muted)" }}
              >
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No distributors match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((d) => (
                  <DistributorCard
                    key={d.id}
                    d={d}
                    onClick={() => setSelected(d)}
                  />
                ))}
              </div>
            )}
          </div>

          {selected && (
            <DetailModal d={selected} onClose={() => setSelected(null)} />
          )}
        </>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="dd-root min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
      <div
        className="h-10 w-10 rounded-full animate-spin"
        style={{
          border: "4px solid var(--dd-primary-soft)",
          borderTopColor: "var(--dd-primary)",
        }}
      />
      <p className="text-sm" style={{ color: "var(--dd-muted)" }}>
        Loading distributors...
      </p>
    </div>
  );
}

function ErrorState({ error }) {
  console.error(error);
  return (
    <div className="dd-root">
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-semibold" style={{ color: "var(--dd-accent)" }}>
          Something went wrong
        </p>
        <p className="text-sm" style={{ color: "var(--dd-muted)" }}>
          {error?.message || "Failed to load channel partners."}
        </p>
      </div>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3"
          style={{
            background: "var(--dd-surface)",
            border: "1px solid var(--dd-accent)",
            boxShadow: "0 12px 24px -8px rgba(20,30,40,0.25)",
          }}
        >
          <Toast.Title
            className="text-sm font-semibold"
            style={{ color: "var(--dd-accent)" }}
          >
            Failed to load data
          </Toast.Title>
          <Toast.Description
            className="text-xs"
            style={{ color: "var(--dd-muted)" }}
          >
            {error?.message || "Please try again later."}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}
function DistributorCard({ d, onClick }) {
  const code = isoCode(d.iso);

  return (
    <button
      type="button"
      onClick={onClick}
      className="dd-btn-reset group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--dd-primary)] [box-shadow:0_12px_35px_rgba(0,0,0,0.08)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--dd-primary)]/10">
            {code ? (
              <span className="font-bold text-[15px] text-[var(--dd-primary)]">
                {code}
              </span>
            ) : (
              <MapPin className="h-5 w-5 text-[var(--dd-primary)]" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="dd-serif truncate text-lg font-semibold text-gray-900">
              {d.country}
            </h3>

            {d.region && (
              <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-500">
                {d.region}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Company */}
      <div className="mt-5">
        <div className="mb-1 flex items-center gap-2 text-gray-500">
          <Building2 className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wider">Distributor</span>
        </div>

        <p className="line-clamp-2 text-sm font-medium text-gray-800">
          {d.company}
        </p>
      </div>

      {/* Contact */}
      {/* {(d.mobile || d.email) && (
        <div className="mt-5 space-y-2">
          {d.mobile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-[var(--dd-primary)]" />
              <span>{d.mobile}</span>
            </div>
          )}

          {d.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-[var(--dd-primary)]" />
              <span className="truncate">{d.email}</span>
            </div>
          )}
        </div>
      )} */}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t pt-4">
        {d.map_iframe ? (
          <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-medium text-green-700">
            Map Available
          </span>
        ) : (
          <span />
        )}

        <span className="flex items-center gap-1 text-sm font-semibold text-[var(--dd-primary)] transition-all group-hover:translate-x-1">
          View Details
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

function DetailModal({ d, onClose }) {
  const createdDate = d.created_at
    ? new Date(d.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const code = isoCode(d.iso);

  return (
    <div
      className="dd-root dd-modal-backdrop dd-anim-fade fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="dd-modal dd-anim-slide w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--dd-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="sticky top-0 p-5 sm:p-6 rounded-t-2xl flex items-start justify-between gap-3 text-white"
          style={{
            background: `linear-gradient(120deg, var(--dd-primary), var(--dd-primary-dark))`,
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {code ? (
                <span
                  className="dd-iso-chip"
                  style={{
                    background: "rgba(255,255,255,0.16)",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                  }}
                >
                  {code}
                </span>
              ) : (
                <MapPin className="w-5 h-5 shrink-0" />
              )}
              <h2 className="dd-serif text-lg sm:text-xl font-semibold italic truncate">
                {d.country}
              </h2>
            </div>
            <p
              className="text-sm mt-1 truncate"
              style={{ color: "var(--dd-primary-soft)" }}
            >
              {d.company}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="dd-btn-reset shrink-0 rounded-full p-1.5 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={Globe2} label="Region" value={d.region || "—"} />
            <InfoRow
              icon={Building2}
              label="Company"
              value={d.company || "—"}
            />
            <InfoRow
              icon={Phone}
              label="Mobile"
              value={d.mobile || "—"}
              href={d.mobile ? `tel:${d.mobile}` : null}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={d.email || "—"}
              href={d.email ? `mailto:${d.email}` : null}
            />
          </div>

          {d.map_iframe ? (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--dd-muted)" }}
              >
                Location
              </p>
              <div
                className="dd-map-wrap rounded-xl overflow-hidden"
                style={{
                  border: "1px solid var(--dd-border)",
                  height: "16rem",
                }}
                dangerouslySetInnerHTML={{ __html: d.map_iframe }}
              />
            </div>
          ) : (
            <div
              className="rounded-xl p-6 text-center text-sm"
              style={{
                border: "1px dashed var(--dd-border)",
                color: "var(--dd-muted)",
              }}
            >
              <MapPin className="w-6 h-6 mx-auto mb-2 opacity-40" />
              Map not available for this distributor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="dd-row flex items-start gap-2.5 rounded-lg p-3">
      <Icon
        className="w-4 h-4 shrink-0 mt-0.5"
        style={{ color: "var(--dd-primary)" }}
      />
      <div className="min-w-0">
        <p
          className="text-[11px] uppercase tracking-wide font-medium"
          style={{ color: "var(--dd-muted)" }}
        >
          {label}
        </p>
        <p className="text-sm break-words" style={{ color: "var(--dd-ink)" }}>
          {value}
        </p>
      </div>
      {href && (
        <ExternalLink
          className="w-3.5 h-3.5 ml-auto shrink-0"
          style={{ color: "var(--dd-border)" }}
        />
      )}
    </div>
  );

  return href ? (
    <a href={href} className="block rounded-lg">
      {content}
    </a>
  ) : (
    content
  );
}
