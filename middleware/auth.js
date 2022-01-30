"use strict";
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");

const privateKey = process.env.JWT_SECRET_KEY;

exports.generateToken = async (data) => {
  return jwt.sign(data, privateKey, { expiresIn: "1h" });
};

exports.decodeToken = async (token) => {
  var data = await jwt.verify(token, privateKey);
  return data;
};

exports.checkTokenExists = async (req, res, next) => {
  let token = req.query.token || req.headers["x-access-token"];

  //console.log(req.headers)
  if (!token) {
    return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({
      message: "Access Restricted!"
    });
  }

  req.accessToken = token;

  next();
};

exports.verifyAccessToken = (req, res, next) => {
  let token = req.accessToken;

  if (!token) return next();

  jwt.verify(token, privateKey, async function (error, decoded) {
    if (error) {
      return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({
        message: "Token Invalid"
      });
    }

    if (!decoded.username) {
      return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({
        message: "No user found"
      });
    }

    req.user = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    };

    next();
  });
};

/**
 * Authentication Middlewares
 * Sends 401 response if any error or no token is set in request
 */
exports.authorize = [exports.checkTokenExists, exports.verifyAccessToken];
