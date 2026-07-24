import PayU from "payu-websdk";
import config from "../config/index.js";

export const payuClient = new PayU(
  {
    key: config.payu_merchant_key,
    salt: config.payu_merchant_salt,
  },
  config.payu_env
);
