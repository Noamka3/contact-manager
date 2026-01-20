const { validateContact, ValidationError } = require("../utils/validation");

describe("validation.js", () => {
  test("valid contact passes", () => {
    expect(() =>
      validateContact({
        name: "John Doe",
        email: "john@example.com",
        phone: "555-1234",
      })
    ).not.toThrow();
  });

  test("missing name throws ValidationError", () => {
    expect(() =>
      validateContact({
        name: "",
        email: "john@example.com",
        phone: "555-1234",
      })
    ).toThrow(ValidationError);
  });

  test("email without @ throws correct message", () => {
    expect(() =>
      validateContact({
        name: "John",
        email: "invalid-email",
        phone: "555-1234",
      })
    ).toThrow("Email must contain @ symbol");
  });

  test("missing phone throws ValidationError", () => {
    expect(() =>
      validateContact({
        name: "John",
        email: "john@example.com",
        phone: "",
      })
    ).toThrow(ValidationError);
  });
});
