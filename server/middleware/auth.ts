import express, { NextFunction, Request as any, Response } from "express";
import { Secret, verify } from "jsonwebtoken";
const authenticate = (req: any, res: any) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return false;
    }
    const jwtObj = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as any;
    req.user = jwtObj._doc;
    req.user.id = req.user._id;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = {
  ensureAuth: function (req: any, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    } else if (authenticate(req, res)) {
      return next();
    } else {
      return res.redirect("/");
    }
  },
  ensureGuest: function (req: any, res: Response, next: NextFunction) {
    authenticate(req, res);
    if (!req.isAuthenticated()) {
      return next();
    } else if (!authenticate(req, res)) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};

