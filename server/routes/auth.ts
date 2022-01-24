import express, { NextFunction, Request, Response } from "express";
const passport = require("passport");
const router = express.Router();
const session = require('express-session')

// @desc    Auth with Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", function (req: any, res) {
  res.clearCookie("refreshtoken");
  res.clearCookie("accessToken");
  req.logOut(); // <-- not req.logout();
  res.redirect("/");
});

export default router;
