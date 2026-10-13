"use strict";

import controller from "./controller.js";

// Admin (JWT protected) — registered in routes/v1/index.js
export default async function routes(fastify, options) {
  fastify.get("/", {}, controller.get);
  fastify.get("/:id", {}, controller.getById);
  fastify.put("/:id", {}, controller.updateById);
  fastify.delete("/:id", {}, controller.deleteById);
}

// Public — registered in routes/v1/public.js
export async function distributorEnquiryPublicRoutes(fastify, options) {
  fastify.get("/options", {}, controller.options);

  fastify.post(
    "/",
    {
      // stricter limit than the global one: public form, spam target
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    controller.create,
  );
}
