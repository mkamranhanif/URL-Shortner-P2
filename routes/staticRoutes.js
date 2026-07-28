const express = require("express")
const URL = require("../models/url") //import the model from model

const { restrictTo } = require("../middleware/auth")

const router = express.Router()

//builder for static routes to execute the home.ejs file for SSR
router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allUrls = await URL.find({})
  return res.render("home", {
    urls: allUrls,
  })
})

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allUrls = await URL.find({ createdBy: req.user._id })
  return res.render("home", {
    urls: allUrls,
  })
})

router.get("/signup", async (req, res) => {
  res.render("signup")
})
router.get("/login", async (req, res) => {
  res.render("login")
})

module.exports = router
