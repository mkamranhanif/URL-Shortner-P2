const express = require("express")
const urlRouter = require("./routes/url")
const { connectMongosDB } = require("./connection")
const staticRoute = require("./routes/staticROutes")
const path = require("path")
const { handleGetById, handleDataView } = require("./controllers/url")


const app = express()
const PORT = 8001

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/", staticRoute)

connectMongosDB("mongodb://127.0.0.1:27017/urlShortner")
    .then(() => console.log("mongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err))

app.use("/", urlRouter)

app.get("/analytics/:shortid", handleDataView)

app.get("/:shortid", handleGetById)

app.listen(PORT, () => console.log("server has started"))