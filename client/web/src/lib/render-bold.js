import { createElement } from "react";

// "plain **bold** plain" => ["plain ", <strong>bold</strong>, " plain"]
export function renderBold(text) {
  return text.split("**").map((part, i) =>
    i % 2
      ? createElement("strong", { key: i, className: "font-semibold" }, part)
      : part,
  );
}
