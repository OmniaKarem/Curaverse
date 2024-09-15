import e from "express";

export const signUpSchema = {
  name: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 4 },
      errorMessage: "Name must be at least 4 characters",
    },
  },
  email: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  password: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Password cannot be empty",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
  },
  confirmPassword: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Confirm password cannot be empty",
    },
    isString: {
      errorMessage: "Confirm password must be a string",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Confirm password must be at least 6 characters",
    },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: "It must be the same as the password",
    },
  },
  gender: {
    in: ["body"],
    isIn: {
      options: [["Male", "female"]],
      errorMessage: "Gender must be either Male or Female",
    },
  },
};

export const nameOrPasswordSchema = {
  name: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 4 },
      errorMessage: "Name must be at least 4 characters",
    },
  },
  password: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
  },
};
