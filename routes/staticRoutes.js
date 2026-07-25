const express = require("express")
const URL = require("../models/url") //import the model from model

const router = express.Router()

//builde for static routes to execute the home.ejs file for SSR
router.get("/", async (req, res) => {
  const allUrls = await URL.find({})
  return res.render("home", {
    urls: allUrls,
  })
})

module.exports = router
