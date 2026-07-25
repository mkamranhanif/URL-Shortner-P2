const express = require("express")
const { handleGenerateShortUrl } = require("../controllers/url")

const router = express.Router()

//calls the generator method 1 from controller
router.post("/", handleGenerateShortUrl)

module.exports = router
