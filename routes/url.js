const express = require("express")
const { handleGenerateShortUrl } = require("../controllers/url")

const { restrictTo } = require("../middleware/auth")

const router = express.Router()

//calls the generator method 1 from controller
router.post("/", restrictTo(["NORMAL"]), handleGenerateShortUrl)

module.exports = router
