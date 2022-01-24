import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Travel = require("../models/Travel");
import { registerUser, register, signin, loginUser } from "./service";

// @desc    Login/Landing page
// @route   GET /
router.route("/register").get(register).post(registerUser);

router.route("/signin").get(signin).post(loginUser);

router.get("/travels", ensureAuth, async (req: any, res) => {
  try {
    const travels = await Travel.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    travels.forEach((travel: { user: { _id: any } }) => travel.user._id);
    res.render("travels/index", {
      user: req.user,
      travels,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/dashboard", ensureAuth, async (req: any, res) => {
  try {
    const travels = await Travel.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      travels,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
// router.get('/', ensureGuest, (req, res) => {
//   res.redirect('/travels')})

router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// router.get('/', ensureGuest, (req, res) => {
//   res.redirect('/travels')})

router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});


router.get("/", ensureGuest, async (req, res) => {
  try {
    const travels = await Travel.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("travels/homepage", {
      travels,
      layout: "login",
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/:id", async (req: any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).populate("user").lean();

    if (!travel) {
      return res.render("error/404");
    }

    if (travel.status == "private") {
      res.render("error/404");
    } else {
      res.render("travels/show2", {
        travel,
        layout: "login",
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const travels = await Travel.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("travels/homepage", {
      travels,
      layout: "login",
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req: any, res) => {
  try {
    const travels = await Travel.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      travels,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

export default router;
