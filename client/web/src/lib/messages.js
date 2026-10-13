// Helpers for country content that lives in messages/<locale>.json.
//
// Rule: a country only overrides what its JSON contains. A missing key means
// "keep the existing static content", so empty files ({}) change nothing.

// Only these namespaces are sent to client components (see layout.js).
// Page copy (Home, About, Seo, Schema) is read on the server and passed as props.
export const CLIENT_NAMESPACES = ["Hero", "Footer"];

export function pickMessages(messages, keys) {
  return Object.fromEntries(
    keys.filter((key) => messages?.[key] != null).map((key) => [key, messages[key]]),
  );
}

// FAQPage JSON-LD built from the same Q&A list that is shown on the page,
// so the visible FAQ and the schema can never drift apart.
export function faqSchema(faq, id) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// [...schemas from messages, FAQPage generated from faq]  ([] when nothing is set)
export function buildSchemas(schemas = [], faq, faqId) {
  return [...schemas, ...(faq?.length ? [faqSchema(faq, faqId)] : [])];
}
