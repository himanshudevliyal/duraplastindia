export const categoryOrder = [
  "SKYLIGHTING AND GLAZING",
  "ROOF VENTILATION",
  "LIGHT AND AIR",
  "SPECIALIZED INDUSTRIAL ROOFING",
  "ROOF CURBS",
];

export function sortCategories(categories = []) {
  return [
    ...categoryOrder
      .map((title) => categories.find((c) => c.title === title))
      .filter(Boolean),

    ...categories.filter((c) => !categoryOrder.includes(c.title)),
  ];
}
