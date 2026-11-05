import config from "@/config";

// Full URL for an uploaded file path ("public/images/x.png").
// Works whether NEXT_PUBLIC_FILE_BASE ends with "/" or not (no "//public"),
// and fixes Windows-style backslashes saved by a local server.
export const fileUrl = (path) => {
  if (!path) return "";
  const clean = String(path).trim().replaceAll("\\", "/");
  if (/^(https?:|blob:|data:)/i.test(clean)) return clean;

  const base = (config.file_base || "").trim().replace(/\/+$/, "");
  return `${base}/${clean.replace(/^\/+/, "")}`;
};
