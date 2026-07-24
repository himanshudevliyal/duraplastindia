"use strict";
import "dotenv/config";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3001;

const config = {
  port: parseInt(process.env.PORT, 10),
  site_url: process.env.BDS_SITE_URL,
  // postgres creds
  pg_database: process.env.PG_DATABASE_NAME,
  pg_username: process.env.PG_USERNAME,
  pg_password: process.env.PG_PASSWORD,
  pg_host: process.env.PG_HOST,
  pg_dialect: process.env.DB_DIALECT,

  // jwt secret key
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [],

  // smtp
  smtp_from_email: process.env.SMTP_EMAIL,
  smtp_port: parseInt(process.env.SMTP_PORT) || 465,
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_user: process.env.BDS_SMTP_USER,
  smtp_password: process.env.BDS_SMTP_PASSWORD,

  // payu
  payu_merchant_key: process.env.PAYU_MERCHANT_KEY,
  payu_merchant_salt: process.env.PAYU_MERCHANT_SALT,
  payu_env: process.env.PAYU_ENV,
};

export default config;
