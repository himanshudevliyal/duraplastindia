"use strict";

import constants from "../lib/constants/index.js";
import config from "../config/index.js";
import table from "../db/models.js";
import jwt from "jsonwebtoken";

let expiresIn = constants.time.TOKEN_EXPIRES_IN;
function generateAccessToken(userData) {
  return [
    jwt.sign({ user: userData }, config.jwt_secret, {
      expiresIn: String(expiresIn),
    }),
    expiresIn,
  ];
}

function generateRefreshToken(userData) {
  return [
    jwt.sign({ user: userData }, config.jwt_refresh_secret, {
      expiresIn: constants.time.REFRESH_TOKEN_EXPIRES_IN,
    }),
    constants.time.REFRESH_TOKEN_EXPIRES_IN,
  ];
}

const verifyToken = async (req, res) => {
  const authHeader = req.headers["authorization"] ?? req.cookies.token;
  if (!authHeader) {
    return res.code(401).send({ message: "unauthorized!" });
  }
  const token = authHeader.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) {
    return res
      .code(401)
      .send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    const userData = await table.UserModel.getByUsername(req, decoded);
    if (!userData) return res.code(401).send({ message: "User not found" });

    req.user_data = userData;
    req.decoded = decoded;
  } catch (error) {
    // throw error;
    return res.code(401).send({ message: "Invalid token or token expired" });
  }
  return;
};

const verifyRefreshToken = async (req, res) => {
  const refreshToken = req.body.refresh_token;

  try {
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret);
    const userData = await table.UserModel.getById(0, decoded.user.id);
    if (!userData) return res.code(401).send({ message: "User not found" });

    const [jwtToken, time] = generateAccessToken(decoded.user);
    return res.send({ token: jwtToken, expire_time: Date.now() + time });
  } catch (error) {
    // throw error;
    return res.code(401).send({
      status: false,
      message: "Invalid refresh token or a refresh token is expired",
    });
  }
};

// Public routes: true when the request carries a valid logged-in user's token.
// Never sends a response (unlike verifyToken).
const isAuthenticated = async (req) => {
  const authHeader = req.headers["authorization"] ?? req.cookies?.token;
  if (!authHeader) return false;
  const token = authHeader.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    const userData = await table.UserModel.getByUsername(req, decoded);
    return !!userData;
  } catch {
    return false;
  }
};

// Drafts are returned only to the dashboard: it asks with ?include_drafts=true
// and sends a valid token. The website never gets drafts.
const canSeeDrafts = async (req) =>
  req.query?.include_drafts === "true" && (await isAuthenticated(req));

export default {
  verifyToken,
  isAuthenticated,
  canSeeDrafts,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
