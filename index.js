const express = require("express")
const urlRouter = require("./routes/url")
const { connectMongosDB } = require("./connection")
const URL = require("./models/url")


const app = express()
const PORT = 8001

app.use(express.json())

connectMongosDB("mongodb://127.0.0.1:27017/urlShortner")
    .then(() => console.log("mongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err))

app.get("/:shortid", async (req, res) => {
    const shortId = req.params.shortid
    const allShortData = await URL.findOneAndUpdate({
        shortId

    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })


    res.redirect(allShortData.redirectURL)
})


app.use("/", urlRouter)

app.listen(PORT, () => console.log("server has started"))