import { createElement } from "react";

const SITE = "https://www.duraplastindia.com";
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

// Country copy with **bold** and [text](url) links => React nodes.
// Links to this site become relative paths (they already carry the /eg ...
// prefix); other links open in a new tab.
export function renderRich(text = "") {
  return String(text)
    .split(TOKEN)
    .filter((part) => part !== "")
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return createElement(
          "strong",
          { key: i, className: "font-semibold" },
          part.slice(2, -2),
        );
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, url] = link;
        const internal = url.startsWith(SITE) || url.startsWith("/");
        return createElement(
          "a",
          {
            key: i,
            href: internal ? url.replace(SITE, "") || "/" : url,
            className:
              "font-medium text-primary underline-offset-4 hover:underline",
            ...(internal ? {} : { target: "_blank", rel: "noopener" }),
          },
          label,
        );
      }
      return part;
    });
}
