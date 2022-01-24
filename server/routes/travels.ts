import express, { NextFunction, Request, Response } from "express";
import path from "path";
const router = express.Router(),
  multer = require("multer");
const { ensureAuth } = require("../middleware/auth");

const Travel = require("../models/Travel");

// Storage setup
var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (
    _req: any,
    file: { fieldname: string; originalname: any },
    done: (arg0: null, arg1: string) => void
  ) {
    done(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Upload setup
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 3000000,
  },
}).array("images");

// Check file type
function checkFileType(
  file: { originalname: any; mimetype: string },
  callback: (arg0: null, arg1: boolean) => void
) {
  // Allowed extensions
  var fileTypes = /jpeg|jpg|png|gif/;
  // Check extention
  var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  var mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return callback(null, true);
  }
  callback(null, false);
}

// @desc    Show add page
// @route   GET /travels/add
router.get("/add", ensureAuth, (_req, res) => {
  res.render("travels/add");
});

// @desc    Process add form
// @route   POST /travels
router.post("/", ensureAuth, async (req: any, res) => {
  try {
    upload(req, res, async function (err: { message: any }) {
      if (err) {
        console.error(err);
        return res.render("error/500");
      }

      const travel = req.body;
      travel.user = req.user.id;
      travel.images = [];
      req.files.forEach((file: { filename: any }) =>
        travel.images.push("/uploads/" + file.filename)
      );

      await Travel.create(travel);
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show all travels
// @route   GET /stories

// @desc    Show single travel
// @route   GET /travels/:id

router.get("/:id", ensureAuth, async (req: any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).populate("user").lean();
    if (!travel) {
      return res.render("error/404");
    }

    if (travel.user._id != req.user.id && travel.status == "private") {
      res.render("error/404");
    } else {
      res.render("travels/show", {
        travel,
        user: req.user,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// @desc    Show edit page
// @route   GET /travels/edit/:id
router.get("/edit/:id", ensureAuth, async (req: any, res) => {
  try {
    const travel = await Travel.findOne({
      _id: req.params.id,
    }).lean();

    if (!travel) {
      return res.render("error/404");
    }

    if (travel.user != req.user.id) {
      res.redirect("/travels");
    } else {
      res.render("travels/edit", {
        travel,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});


// @desc    Update travels
// @route   PUT /travels/:id
router.put("/:id", ensureAuth, async (req: any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).lean();
    if (!travel) {
      return res.render("error/404");
    }

    if (travel.user != req.user.id) {
      res.redirect("/travels");
    } else {
      upload(req, res, async function (err: { message: any }) {
        if (err) {
          console.error(err);
          return res.render("error/500");
        }

        const newTravel = req.body;
        newTravel.user = req.user.id;
        const images: string[] = [];
        if (req.files && req.files.length > 0) {
          req.files.forEach((file: { filename: any }) =>
            images.push("/uploads/" + file.filename)
          );
        }
        if (images.length > 0) newTravel.images = images;

        await Travel.findOneAndUpdate({ _id: req.params.id }, newTravel,
          {
            new: true,
            runValidators: true,
          });
        res.redirect("/dashboard");
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete travel logs
// @route   DELETE /travels/:id
router.delete("/:id", ensureAuth, async (req: any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).lean();

    if (!travel) {
      return res.render("error/404");
    }

    if (travel.user != req.user.id) {
      res.redirect("/travels");
    } else {
      await Travel.deleteOne({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    User travels
// @route   GET /travels/user/:userId
router.get("/user/:userId",ensureAuth, async (req:any, res) => {
  try {
    const travels = await Travel.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("travels/index", {
      travels,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});


export default router;
