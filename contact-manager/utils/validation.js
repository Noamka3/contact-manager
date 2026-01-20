// utils/validation.js

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateName(name) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new ValidationError("Name is required");
  }
}

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    throw new ValidationError("Email is required");
  }
  if (!email.includes("@")) {
    throw new ValidationError("Email must contain @ symbol");
  }
}

function validatePhone(phone) {
  if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
    throw new ValidationError("Phone is required");
  }
}

function validateContact({ name, email, phone }) {
  validateName(name);
  validateEmail(email);
  validatePhone(phone);
}

module.exports = {
  ValidationError,
  validateContact,
};
