const { validateLoginInput } = require("../src/util/validators");

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
