"use strict";
import constants from "../../lib/constants/index.js";
import hash from "../../lib/encryption/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let UserModel = null;

const init = async (sequelize) => {
  UserModel = sequelize.define(
    constants.models.USER_TABLE,
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fullname: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM({
          values: ["super_admin", "admin", "user"],
        }),
        defaultValue: "user",
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return UserModel;

  await UserModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;
  const hash_password = req.body.password
    ? hash.encrypt(req.body.password)
    : "";

  const data = await UserModel.create(
    {
      username: req.body.username,
      password: hash_password,
      fullname: req.body?.fullname,
      role: req.body?.role,
      is_active: req.body.is_active ?? true,
    },
    options,
  );

  return data.dataValues;
};

const get = async (req) => {
  const whereConditions = ["usr.role != 'admin'"];
  const queryParams = {};
  const q = req.query.q ? req.query.q : null;

  if (q) {
    whereConditions.push(
      `(usr.fullname ILIKE :query OR usr.username ILIKE :query)`,
    );
    queryParams.query = `%${q}%`;
  }

  const roles = req.query.role ? req.query.role.split(".") : null;
  if (roles?.length) {
    whereConditions.push(`usr.role = any(:roles)`);
    queryParams.roles = `{${roles.join(",")}}`;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = (page - 1) * limit;

  let whereClause = "";
  if (whereConditions.length) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  const query = `
  SELECT 
    usr.id, usr.fullname, usr.username, usr.role,   usr.is_active,
 usr.created_at
  FROM ${constants.models.USER_TABLE} usr
  ${whereClause}
  ORDER BY usr.created_at DESC
  LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
    COUNT(usr.id) OVER()::integer as total
  FROM ${constants.models.USER_TABLE} usr
  ${whereClause}
  LIMIT :limit OFFSET :offset
  `;

  const users = await UserModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await UserModel.sequelize.query(countQuery, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  return { users, total: count?.[0]?.total ?? 0 };
};

const getById = async (req, user_id) => {
  let query = `
  SELECT
      usr.*
    FROM ${constants.models.USER_TABLE} usr
    WHERE usr.id = :user_id
  `;
  const data = await UserModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { user_id: req?.params?.id || user_id },
    raw: true,
    plain: true,
  });

  return data;
};

const getByUsername = async (req, record = undefined) => {
  let query = `
  SELECT
      usr.*
    FROM ${constants.models.USER_TABLE} usr
    WHERE usr.username = :username
  `;

  return await UserModel.sequelize.query(query, {
    replacements: {
      username: req?.body?.username || record?.user?.username,
    },
    raw: true,
    plain: true,
  });
};

const isUsernameExist = async (username) => {
  const user = await UserModel.findOne({ where: { username } });
  return !!user;
};

const update = async (req, id, transaction = null) => {
  const options = {
    where: {
      id: req.params?.id || id,
    },
    plain: true,
    transaction,
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await UserModel.update(
    {
      username: req.body.username,
      fullname: req.body?.fullname,
      role: req.body?.role,
      is_active: req.body.is_active,
    },
    options,
  );
};

const updatePassword = async (req, user_id) => {
  const hash_password = hash.encrypt(req.body.password);
  return await UserModel.update(
    { password: hash_password },
    { where: { id: req.params?.id || user_id } },
  );
};

const updateUsername = async (req, user_id) => {
  return await UserModel.update(
    { username: req.body.username },
    { where: { id: req.params?.id || user_id } },
  );
};

const deleteById = async (req, user_id) => {
  return await UserModel.destroy({
    where: {
      id: req?.params?.id || user_id,
    },
    returning: true,
    raw: true,
  });
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  getByUsername: getByUsername,
  update: update,
  updatePassword: updatePassword,
  deleteById: deleteById,
  isUsernameExist: isUsernameExist,
  updateUsername: updateUsername,
};
