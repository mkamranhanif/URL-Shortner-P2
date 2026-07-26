const { name } = require("ejs")
const { v4: uuidv4 } = require("uuid")
const User = require("../models/user")
const { setUser } = require("../service/auth")

async function handleUserCreation(req, res) {
  const { name, email, password } = await req.body
  if (!req.body) return console.log("user info is required")
  User.create({
    name,
    email,
    password,
  })
  res.redirect("/")
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body
  const userLogin = await User.findOne({ email, password })
  if (!userLogin)
    return res.render("login", {
      error: "invalid email or password",
    })

  const sessionId = uuidv4()
  setUser(sessionId, userLogin)
  res.cookie("uid", sessionId)
  res.redirect("/")
}

module.exports = {
  handleUserCreation,
  handleUserLogin,
}
