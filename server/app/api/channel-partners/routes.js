"use strict";

import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["address", "logo"]),
    },
    controller.create,
  );

  fastify.post("/bulk", {}, controller.createBulk);

  fastify.put(
    "/:id",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["address", "logo"]),
    },
    controller.updateById,
  );

  fastify.delete("/:id", {}, controller.deleteById);
}

export async function channelPartnerPublicRoutes(fastify, opt) {
  fastify.get("/:id", {}, controller.getById);
  fastify.get("/", {}, controller.get);
}
