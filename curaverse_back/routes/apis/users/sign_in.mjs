import { Router } from "express";
import "../../../strategies/local-strategy.mjs";
import passport from "passport";

const router = new Router();

router.post("/signin", (req, res, next) => {
passport.authenticate("local", (err, user, info) => {
    if (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
        return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
        if (err) {
        return res.status(500).json({ message: "Internal server error" });
        }
        console.log("User logged in successfully!");
        return res.status(200).json(user);
        });
    })(req, res, next);
});

export default router;
