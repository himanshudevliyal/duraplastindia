import { notFound } from "next/navigation";

// Any URL no other route matches (e.g. /in/a/b/c) => the site's 404 page
// (app/[locale]/not-found.js, inside the header and footer).
export default function CatchAll() {
  notFound();
}
