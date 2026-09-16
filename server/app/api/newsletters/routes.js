"use strict";

import controller from "./controller.js";

export default async function routes(fastify, options) {
  // Admin routes

  fastify.get(
    "/",
    {},
    controller.get,
  );

  fastify.get(
    "/:id",
    {},
    controller.getById,
  );

  fastify.delete(
    "/:id",
    {},
    controller.deleteById,
  );
}

export async function newsletterPublicRoutes(
  fastify,
  options,
) {
  // Public newsletter subscription

  fastify.post(
    "/subscribe",
    {},
    controller.subscribe,
  );
}