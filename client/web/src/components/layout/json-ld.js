// Renders one <script type="application/ld+json"> per schema object.
export function JsonLd({ data }) {
  const list = Array.isArray(data) ? data : [data];

  return list.map((item, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(item).replace(/</g, "\\u003c"),
      }}
    />
  ));
}
