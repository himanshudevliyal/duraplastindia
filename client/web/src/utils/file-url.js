// Builds a safe absolute URL for a file saved by the API.
// Returns null when the path is empty/invalid so callers can skip <Image>
// instead of crashing with "Failed to construct 'URL': Invalid URL".
export const getFileUrl = (path) => {
  if (!path || typeof path !== "string") return null;

  const cleaned = path.trim().replaceAll("\\", "/");
  if (!cleaned) return null;

  // already absolute
  if (/^https?:\/\//i.test(cleaned)) {
    try {
      return new URL(cleaned).href;
    } catch {
      return null;
    }
  }

  const base = (process.env.NEXT_PUBLIC_FILE_BASE || "").replace(/\/+$/, "");
  if (!base) return null;

  try {
    return new URL(`${base}/${cleaned.replace(/^\/+/, "")}`).href;
  } catch {
    return null;
  }
};
