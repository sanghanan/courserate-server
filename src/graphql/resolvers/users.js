const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../util/getTokens");
const { validateRefreshToken } = require("../../util/checkAuth");

const setTokens = (user, response) => {
  response.cookie("refresh-token", generateRefreshToken(user), {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  const accessToken = generateAccessToken(user);
  const accessTokenExpiry = new Date(new Date().getTime() + 15 * 60 * 1000);
  return { token: accessToken, expiresIn: accessTokenExpiry };
};

module.exports = {
  Query: {
    async user(_, { username }) {
      try {
        const user = await User.findOne({ username });
        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { email, password }, { response }) {
      const { errors, valid } = validateLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ email });
      if (!user) {
        errors.general = "The email is incorrect";
        throw new UserInputError("The email is incorrect", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "The password is incorrect.";
        throw new UserInputError("The password is incorrect", { errors });
      }

      const tokens = setTokens(user, response);

      return {
        user: {
          username: user.username,
          createdAt: user.createdAt,
          email: user.email,
          id: user._id,
        },
        jwt: tokens,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      { response }
    ) {
      // Validate User Data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //  check for unique username and email
      let user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken.",
          },
        });
      }

      user = await User.findOne({ email });
      if (user) {
        throw new UserInputError("This email is taken", {
          errors: {
            email: "This email is taken.",
          },
        });
      }

      // Hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const savedUser = await newUser.save();
      const tokens = setTokens(newUser, response);
      return {
        user: { email, username, createdAt, id: savedUser._id },
        jwt: tokens,
      };
    },

    async logout(_, __, { response }) {
      response.cookie("refresh-token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
      });
      return "User logged out successfully";
    },

    async refreshToken(_, __, { request, response }) {
      const token = request.cookies["refresh-token"];
      const user = await validateRefreshToken(token);
      if (user) {
        const tokens = setTokens(user, response);
        return tokens;
      }
    },
  },
};
