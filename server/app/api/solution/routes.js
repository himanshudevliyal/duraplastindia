"use strict";
import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "related_products",
          "date",
          "city",
          "faq",
          "country_seo",
          "jsonld_schema",
        ]),
    },
    controller.create,
  );
  fastify.put(
    "/:id",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "related_products",
          "picture_urls",
          "date",
          "city",
          "faq",
          "country_seo",
          "jsonld_schema",
        ]),
    },
    controller.updateById,
  );
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function solutionPublicRoutes(fastify, opt) {
  fastify.get("/get-by-slug/:slug", {}, controller.getBySlug);
  fastify.get("/", {}, controller.get);
}
