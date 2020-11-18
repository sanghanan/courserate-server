const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const validateRefreshToken = async (refreshToken) => {
  if (refreshToken) {
    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      const foundUser = await User.findById(user.id);
      if (foundUser) {
        if (user.count === foundUser.count) {
          return user;
        }
      }
      throw new Error("Invalid refresh token");
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token");
    }
  }
  throw new AuthenticationError("Refresh token has expired.");
};
const checkAuth = async ({ request }) => {
  const authHeader = request.headers.authorization;
  const refreshToken = request.cookies["refresh-token"];
  if (await validateRefreshToken(refreshToken)) {
    if (authHeader) {
      const token = authHeader.split("Bearer ")[1];
      if (token) {
        try {
          const user = jwt.verify(token, process.env.SECRET_KEY);
          return user;
        } catch (err) {
          throw new AuthenticationError("Invalid/Expired Token");
        }
      }
      throw new Error("Authentication token must be 'Bearer [token]'");
    }
    throw new Error("Authorization Header is not provided");
  }
  throw new Error("Refresh token has expired.");
};

module.exports = { checkAuth, validateRefreshToken };
