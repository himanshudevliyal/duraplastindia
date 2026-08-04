"use strict";
import dashboardController from "./controller.js";

export default async function routes(fastify, opts) {
  fastify.get("/stats", dashboardController.getStats);
  fastify.get("/blogs-by-category", dashboardController.getBlogsByCategory);
  fastify.get(
    "/products-by-category",
    dashboardController.getProductsByCategory,
  );
  fastify.get("/partners-by-region", dashboardController.getPartnersByRegion);
  fastify.get("/content-growth", dashboardController.getContentGrowth);
  fastify.get("/recent-blogs", dashboardController.getRecentBlogs);
  fastify.get("/users-by-role", dashboardController.getUsersByRole);
}
