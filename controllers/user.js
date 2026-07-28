const { name } = require("ejs")
const { v4: uuidv4 } = require("uuid")
const User = require("../models/user")
const { setUser } = require("../service/auth")

async function handleUserCreation(req, res) {
  const { name, email, password } = req.body
  if (!req.body) return res.render("signup", { error: "user info is required" })
  await User.create({
    name,
    email,
    password,
    role: "NORMAL",
  })
  return res.redirect("/login")
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body
  const userLogin = await User.findOne({ email, password })
  if (!userLogin)
    return res.render("login", {
      error: "invalid email or password",
    })

  const token = setUser(userLogin)
  res.cookie("uid", token)
  res.redirect("/")
}

module.exports = {
  handleUserCreation,
  handleUserLogin,
}
