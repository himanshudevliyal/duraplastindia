import jwtVerify from "../../helpers/auth.js";
import userRoutes from "../../api/users/routes.js";
import productRoutes, { blogPublicRoutes } from "../../api/blog/routes.js";
import categoryRoutes from "../../api/category/routes.js";
import cityBlogRoutes from "../../api/city-blog/routes.js";
import productPageRoutes from "../../api/product-page/routes.js";
import channelPartnerPublicRoutes from "../../api/channel-partners/routes.js";
import dashboardRoutes from "../../api/dashboard/routes.js";

export default async function routes(fastify, options) {
  fastify.addHook("onRequest", jwtVerify.verifyToken);
  // fastify.addHook("preHandler", async (request, reply) => {
  //   request.body && console.log("body", request.body);
  // });

  // routes
  fastify.register(userRoutes, { prefix: "users" });
  fastify.register(productRoutes, { prefix: "blogs" });
  fastify.register(categoryRoutes, { prefix: "categories" });
  fastify.register(cityBlogRoutes, { prefix: "city-blogs" });
  fastify.register(productPageRoutes, { prefix: "product-pages" });
  fastify.register(channelPartnerPublicRoutes, { prefix: "channel-partners" });
  fastify.register(dashboardRoutes, { prefix: "dashboard" });
}
