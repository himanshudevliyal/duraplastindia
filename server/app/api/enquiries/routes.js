"use strict";

import controller from "./controller.js";

export default async function routes(fastify, options) {
  // fastify.post("/", {}, controller.create);

  fastify.put("/:id", {}, controller.updateById);

  fastify.delete("/:id", {}, controller.deleteById);

  fastify.get("/:id", {}, controller.getById);
}

export async function enquiryPublicRoutes(fastify, options) {
  fastify.get("/", {}, controller.get);
  fastify.post("/", {}, controller.create);
}
