const express = require("express")
const { handleUserCreation, handleUserLogin } = require("../controllers/user")

const router = express.Router()

router.post("/signup", handleUserCreation)
router.post("/login", handleUserLogin)

module.exports = router
