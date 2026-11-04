"use strict";
import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

// form fields sent as JSON strings in the multipart body
const JSON_FIELDS = ["city", "faq", "country_seo", "jsonld_schema"];

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, JSON_FIELDS),
    },
    controller.create,
  );
  fastify.put(
    "/:id",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [...JSON_FIELDS, "picture_urls"]),
    },
    controller.updateById,
  );
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function customPagePublicRoutes(fastify, opt) {
  fastify.get("/get-by-slug/:slug", {}, controller.getBySlug);
  fastify.get("/", {}, controller.get);
}
