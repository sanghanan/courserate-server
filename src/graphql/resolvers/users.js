const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../util/getTokens");

const setTokens = (user, response) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  response.cookie("refresh-token", refreshToken, {
    expiresIn: 7 * 24 * 60 * 60,
    httpOnly: true,
  });
  response.cookie("access-token", accessToken, {
    expiresIn: 60 * 60,
    httpOnly: true,
  });
};

module.exports = {
  Query: {
    async user(_, { userId }) {
      try {
        const user = await User.findById(userId);
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
        errors.general = "User is not registered";
        throw new UserInputError("User is not registered", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "The password is incorrect.";
        throw new UserInputError("The password is incorrect", { errors });
      }
      setTokens(user, response);
      return { ...user._doc, id: user._id };
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
      const res = await newUser.save();
      setTokens(newUser, response);
      return { ...res._doc, id: res._id };
    },
    async logout(_, __, { response }) {
      response.cookie("refresh-token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return "User logged out successfully";
    },
  },
};
