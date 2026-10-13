"use strict";
import "dotenv/config";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3001;

const config = {
  port: parseInt(process.env.PORT, 10),
  site_url: process.env.SITE_URL,
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
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,

  
  // distributor enquiry mails (comma separated list of admin emails)
  distributor_notify_email: process.env.DISTRIBUTOR_NOTIFY_EMAIL
    ? process.env.DISTRIBUTOR_NOTIFY_EMAIL.split(",")
        .map((e) => e.trim())
        .filter(Boolean)
    : [],
  company_name: process.env.COMPANY_NAME || "Dura Plast India",


  // payu
  payu_merchant_key: process.env.PAYU_MERCHANT_KEY,
  payu_merchant_salt: process.env.PAYU_MERCHANT_SALT,
  payu_env: process.env.PAYU_ENV,
};

export default config;
