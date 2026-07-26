const express = require("express")
const { handleGenerateShortUrl } = require("../controllers/url")

const { restrictToLoggedinUserOnly } = require("../middleware/auth")

const router = express.Router()

//calls the generator method 1 from controller
router.post("/", restrictToLoggedinUserOnly, handleGenerateShortUrl)

module.exports = router
