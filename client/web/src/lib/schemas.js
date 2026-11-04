// Schema markup from the dashboard: a list of schema objects (new), or older
// text with one/more <script> blocks / a JSON string. Returns valid schema
// objects only; invalid ones are skipped.
export function getSchemas(raw) {
  if (!raw) return [];

  if (typeof raw !== "string") {
    return (Array.isArray(raw) ? raw : [raw]).flatMap((item) =>
      typeof item === "string"
        ? getSchemas(item)
        : item && typeof item === "object"
          ? [item]
          : [],
    );
  }

  const blocks = [...raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1],
  );

  return (blocks.length ? blocks : [raw]).flatMap((text) => {
    try {
      const value = JSON.parse(text.replace(/<\/?script[^>]*>/gi, "").trim());
      return value && typeof value === "object" ? getSchemas(value) : [];
    } catch {
      return [];
    }
  });
}
