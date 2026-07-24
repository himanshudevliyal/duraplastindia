import { categoryPublicRoutes } from "../../api/category/routes.js";
import { blogPublicRoutes } from "../../api/blog/routes.js";
import { cityBlogPublicRoutes } from "../../api/city-blog/routes.js";
import { productPagePublicRoutes } from "../../api/product-page/routes.js";

export default async function routes(fastify, options) {
  fastify.register(blogPublicRoutes, { prefix: "blogs" });
  fastify.register(categoryPublicRoutes, { prefix: "categories" });
  fastify.register(cityBlogPublicRoutes, { prefix: "city-blogs" });
  fastify.register(productPagePublicRoutes, { prefix: "product-pages" });
}
