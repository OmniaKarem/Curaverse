import { Router } from "express";
import { User } from "../../../utils/db.mjs";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { signUpSchema } from "../../../utils/validation_schemas.mjs";
import passport from "passport";

const router = Router();

router.post("/signup", checkSchema(signUpSchema), async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const data = matchedData(req);
  try {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
    });

    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging in after sign up" });
      }
      console.log("User signed up and logged in successfully!");
      return res.status(201).json(user);
    });
  } catch (err) {
    return res.status(500).send("Error creating user " + err);
  }
});

export default router;
