import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import { hash, compare } from "bcryptjs";
const User = require("../models/User");
import { createAccessToken, createRefreshToken } from "../config/token";

const registerUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, email, password, password2 } = req.body;
  try {
    if (!firstName || !lastName || !email || !password || !password2) {
      return res.status(400).json({
        message: "Please Input all fields",
      });
    }

    // if (password !== password2) {
    //   return res.render('register', {
    //     error: 'Password do not Match',
    //   });
    // }

    // if (password.length < 6) {
    //   return res.render('register', {
    //     error: 'Password must be greater than 6 characters',
    //   });
    // }

    const hashedPassword = await hash(password, 10);

    let user = await User.findOne({ googleId: email });
    if (user) {
      return res.status(404).json({ message: "user already exist" });
    }
    user = await User.create({
      googleId: email,
      displayName: firstName + " " + lastName,
      firstName: firstName,
      lastName: lastName,
      hashedPassword: hashedPassword,
    });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("refreshToken", refreshToken);
    res.cookie("accessToken", accessToken);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};
const loginUser = async function (req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please Input all fields",
      });
    }

    let user = await User.findOne({ googleId: email });
    if (!user) {
      return res.status(404).json({ message: "invalid input" });
    }

    /* do your hashing here */
    const valid = await compare(password, user.hashedPassword);
    if (!valid) {
      return res.render("signin", {
        error: "Username or Password incorrect",
      });
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("refreshToken", refreshToken);
    res.cookie("accessToken", accessToken);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

const register = (req: Request, res: Response, next: NextFunction) =>
  res.render("travels/register", {
    layout: "login",
  });

const signin = (req: Request, res: Response, next: NextFunction) =>
  res.render("travels/signin", {
    layout: "login",
  });

export { registerUser, register, signin, loginUser };
