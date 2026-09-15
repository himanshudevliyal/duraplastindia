export const categoryOrder = [
  "SKYLIGHTING AND GLAZING",
  "ROOF VENTILATION",
  "SPECIALIZED INDUSTRIAL ROOFING",
  "ROOF CURBS",
  "LIGHT AND AIR",
];

export const productOrder = {
  "SKYLIGHTING AND GLAZING": [
    "RHINO TUFF Polycarbonate Flat Sheets",
    "RHINO TUFF Polycarbonate Corrugated Sheets",
    "RHINO TUFF Polycarbonate (Thermal Insulated) Skylights for Sandwich Panel Roofs",
    "RHINO TUFF Polycarbonate Standing Seam Panel Systems",
    "RHINO TUFF Polycarbonate Skylights (Barrel Vaults) for Standing Seam Roofs",
    "RHNO TUFF Polycarbonate Domes for Steel Roofs",
    "RHINO TUFF Polycarbonate Domes for Flat Roofs",
    "RHINO TUFF Plexiglass Domes",
    "RHINO TUFF Tubular Skylights",
  ],

  "ROOF VENTILATION": [
    "RHINO TUFF Turbine Ventilators",
    "RHINO TUFF Hybrid Ventilators",
  ],

  "SPECIALIZED INDUSTRIAL ROOFING": [
    "RHINO TUFF FRP Roof Sheets",
    "RHINO TUFF FRP Rain Water Gutters with FRP Down Spouts",
  ],

  "ROOF CURBS": [
    "RHINO TUFF Polycarbonate Roof Curbs",
    "RHINO TUFF FRP Roof Curbs",
  ],

  "LIGHT AND AIR": [
    "RHINO TUFF Skylight Dome – Turbine Ventilator Combos",
    "RHINO TUFF Skylight Tube – Turbine Ventilator Combos",
    "RHINO TUFF Polycarbonate Louvers",
  ],
};

export function sortCategories(categories = []) {
  return [
    ...categoryOrder
      .map((title) => categories.find((c) => c.title === title))
      .filter(Boolean)
      .map((category) => ({
        ...category,
        products: sortProducts(category.title, category.products),
      })),

    ...categories
      .filter((c) => !categoryOrder.includes(c.title))
      .map((category) => ({
        ...category,
        products: sortProducts(category.title, category.products),
      })),
  ];
}

export function sortProducts(categoryTitle, products = []) {
  const order = productOrder[categoryTitle];

  if (!order) return products;

  return [...products].sort((a, b) => {
    const aIndex = order.indexOf(a.title);
    const bIndex = order.indexOf(b.title);

    // Ordered products first
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // Products not present in productOrder go to the end
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return 0;
  });
}
