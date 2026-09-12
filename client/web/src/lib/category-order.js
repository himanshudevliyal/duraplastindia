export const categoryOrder = [
  "SKYLIGHTING AND GLAZING",
  "ROOF VENTILATION",
  "SPECIALIZED INDUSTRIAL ROOFING",
  "ROOF CURBS",
  "LIGHT AND AIR",
];

export function sortCategories(categories = []) {
  return [
    ...categoryOrder
      .map((title) => categories.find((c) => c.title === title))
      .filter(Boolean),

    ...categories.filter((c) => !categoryOrder.includes(c.title)),
  ];
}
