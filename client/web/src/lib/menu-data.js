import { fetchProductPages } from "@/services/product-page-services";
import { fetchCategories } from "@/services/category-service";

// Products + categories used by the header menu and the products list
// (useProductPages("") / useCategories("")). Fetched on the server so these
// render in the HTML. Public data: kept in memory for a minute so every page
// request does not call the API, and never waits more than TIMEOUT_MS.
const TTL_MS = 60 * 1000;
const TIMEOUT_MS = 2000;

let cache = { at: 0, data: null };

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]).catch(() => null);

export async function getMenuData() {
  if (cache.data && Date.now() - cache.at < TTL_MS) return cache.data;

  const [productPages, categories] = await Promise.all([
    withTimeout(fetchProductPages("")),
    withTimeout(fetchCategories("")),
  ]);

  const data = { productPages, categories };
  // only cache a complete result; otherwise try again on the next request
  if (productPages && categories) cache = { at: Date.now(), data };

  return data;
}

// Seed a QueryClient with the same query keys the client hooks use.
export function seedMenuQueries(queryClient, { productPages, categories }) {
  if (productPages) queryClient.setQueryData(["product-pages", ""], productPages);
  if (categories) queryClient.setQueryData(["categories", ""], categories);
}
