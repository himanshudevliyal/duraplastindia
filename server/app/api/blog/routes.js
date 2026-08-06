"use strict";
import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["related_products", "date"]),
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
        ]),
    },
    controller.updateById,
  );
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function blogPublicRoutes(fastify, opt) {
  fastify.get("/get-by-slug/:slug", {}, controller.getBySlug);
  fastify.get("/", {}, controller.get);
}
