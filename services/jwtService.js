const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const digestToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createRandomToken = () => crypto.randomBytes(32).toString("hex");

const createAccessToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
  });
};

const createRefreshToken = (user) => {
  const payload = { id: user._id };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

const decodeAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

const decodeRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = {
  digestToken,
  createRandomToken,
  createAccessToken,
  createRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
};
