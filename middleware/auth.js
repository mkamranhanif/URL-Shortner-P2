const { getUser } = require("../service/auth")

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token || req.cookies?.uid
  const authHeader = req.headers?.authorization

  req.user = null

  let token = tokenCookie
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.split(" ")[1]
  }

  if (!token) return next()

  const user = getUser(token)
  req.user = user
  return next()
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login")

    if (!req.user.role || !roles.includes(req.user.role))
      return res.end("UnAuthorized")

    return next()
  }
}

module.exports = {
  checkForAuthentication,
  restrictTo,
  restrict: restrictTo,
  restrictToLoggedinUserOnly: restrictTo(["NORMAL"]),
}
