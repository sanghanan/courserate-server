const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("./getTokens");

require("dotenv").config();
module.exports = async (context) => {
  const accessToken = context.request.cookies["access-token"];
  const refreshToken = context.request.cookies["refresh-token"];
  if (accessToken) {
    try {
      let user = jwt.verify(accessToken, process.env.SECRET_KEY);
      return user;
    } catch (err) {
      console.log("access token:", err.message);
      try {
        if (refreshToken) {
          user = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
          const foundUser = await User.findById(user.id);
          if (foundUser) {
            if (user.count === foundUser.count) {
              console.log("Assigning new tokens");
              context.response.cookie(
                "refresh-token",
                generateRefreshToken(user),
                {
                  expires: new Date(Date.now() + 7 * 24 * 60 * 60),
                  httpOnly: true,
                }
              );
              context.response.cookie(
                "access-token",
                generateAccessToken(user),
                {
                  expires: new Date(Date.now() + 60 * 60),
                  httpOnly: true,
                }
              );
              return user;
            }
          }
        }
        throw new Error("Invalid/Expired Refresh Token");
      } catch (error) {
        console.log("refresh token:", err.message);
        throw new AuthenticationError("Invalid/Expired Refresh Token");
      }
    }
  }
  throw new AuthenticationError("Invalid/Expired Token");
};
