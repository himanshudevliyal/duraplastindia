import { categoryPublicRoutes } from "../../api/category/routes.js";
import { blogPublicRoutes } from "../../api/blog/routes.js";
import { cityBlogPublicRoutes } from "../../api/city-blog/routes.js";
import { productPagePublicRoutes } from "../../api/product-page/routes.js";
import { channelPartnerPublicRoutes } from "../../api/channel-partners/routes.js";
import dashboardRoutes from "../../api/dashboard/routes.js";

export default async function routes(fastify, options) {
  fastify.register(blogPublicRoutes, { prefix: "blogs" });
  fastify.register(categoryPublicRoutes, { prefix: "categories" });
  fastify.register(cityBlogPublicRoutes, { prefix: "city-blogs" });
  fastify.register(productPagePublicRoutes, { prefix: "product-pages" });
  fastify.register(channelPartnerPublicRoutes, { prefix: "channel-partners" });
}
