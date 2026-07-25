const express = require("express") // import the express
const urlRouter = require("./routes/url") //Routes to short link generator method
const { connectMongosDB } = require("./connection") // mongoDB connection
const staticRoute = require("./routes/staticROutes") //routes to the method which executes the views (EJS)
const path = require("path") //used to give a path of the view
const {
  handleGetById,
  handleDataView,
  handleGenerateShortUrl,
} = require("./controllers/url") //imports the methods for get routes

//starting the server/app on port 8001 using express
const app = express()
const PORT = 8001

//middlewares to read data from body(urlencoded) and parse incoming request(express.json)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//setting the EJS as view engine
app.set("view engine", "ejs")

//giving the path of view file
app.set("views", path.resolve("./views"))

//mongoDB connection
connectMongosDB("mongodb://127.0.0.1:27017/urlShortner")
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

//PART 1:
//get the analytics of specific short link
app.get("/analytics/:shortid", handleDataView)

//get the specific object using shortlinke id
app.get("/:shortid", handleGetById)

//PART 2:
//for static routes to execute ejs file
app.use("/", staticRoute)
//directs to the post method to generate short links
app.use("/", urlRouter)

//used to run the server
app.listen(PORT, () => console.log("server has started"))
