const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      count: user.count,
      email: user.email,
      username: user.username,
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
