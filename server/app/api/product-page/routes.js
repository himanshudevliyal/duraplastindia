"use strict";
import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "faq",
          "related_products",
          "overview",
          "why_choose",
          "applications",
          "benefits",
        ]),
    },
    controller.create,
  );
  fastify.put(
    "/:id",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "faq",
          "related_products",
          "picture_urls",
          "overview",
          "why_choose",
          "applications",
          "benefits",
        ]),
    },
    controller.updateById,
  );
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function productPagePublicRoutes(fastify, opt) {
  fastify.get("/get-by-slug/:slug", {}, controller.getBySlug);
  fastify.get("/", {}, controller.get);
}
