const {
  validateLoginInput,
  validateRegisterInput,
  validateCourseInput,
} = require("../src/util/validators");

describe("validate login input", () => {
  test("should be valid when both email and password are passed", () => {
    const { valid } = validateLoginInput("user@domain.com", "user");
    expect(valid).toBe(true);
  });

  test("should throw error when email is empty", () => {
    const { errors } = validateLoginInput("", "user");
    expect(errors.email).toBe("Email must not be empty");
  });

  test("should throw error when password is empty", () => {
    const { errors } = validateLoginInput("user@domain.com", "");
    expect(errors.password).toBe("Password must not be empty");
  });
  test("should throw error when both email and password are empty", () => {
    const { errors } = validateLoginInput("", "");
    expect(errors.email && errors.password).toBeTruthy();
  });
});

describe("validate register input", () => {
  test("should throw error when any of the fields is missing", () => {
    const { errors } = validateRegisterInput("", "", "", "");
    expect(errors.username && errors.password && errors.email).toBeTruthy();
  });

  test("should throw error when email is invalid", () => {
    const { errors } = validateRegisterInput(
      "user",
      "user.domain.com",
      "user",
      "user"
    );
    expect(errors.email).toBe("Email must be a valid email address");
  });

  test("should throw error when the passwords don't match", () => {
    const { errors } = validateRegisterInput(
      "user",
      "user@domain.com",
      "user",
      "user1"
    );
    expect(errors.confirmPassword).toBe("Passwords must match");
  });

  test("should be valid for correct responses", () => {
    const { valid } = validateRegisterInput(
      "user",
      "user@domain.com",
      "user",
      "user"
    );
    expect(valid).toBe(true);
  });
});

describe("validate course input", () => {
  test("should throw error when any of the fields is missing", () => {
    const { valid, errors } = validateCourseInput("", "", "", "", []);
    expect(errors.title).toBe("Title must not be empty");
    expect(errors.link).toBe("Link must not be empty");
    expect(errors.cost).toBe("Cost must not be empty");
    expect(errors.level).toBe("Level must not be empty");
    expect(errors.skills).toBe("Skills must not be empty");
    expect(valid).toBe(false);
  });
});
