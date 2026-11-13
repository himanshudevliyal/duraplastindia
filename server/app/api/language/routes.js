"use strict";
import controller from "./controller.js";

// dashboard (login required)
export default async function routes(fastify, options) {
  fastify.get("/", {}, controller.getLanguages);
  fastify.post("/", {}, controller.createLanguage);
  fastify.get("/countries", {}, controller.getCountries);
  fastify.put("/countries/:country", {}, controller.setCountry);
  fastify.put("/:code", {}, controller.updateLanguage);
  fastify.delete("/:code", {}, controller.deleteLanguage);
}

// website
export async function languagePublicRoutes(fastify, opt) {
  // { [locale]: { country, default, languages: [{ code, name, native_name }] } }
  fastify.get("/sites", {}, controller.getSites);
}
