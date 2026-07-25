const { nanoid } = require("nanoid")
const URL = require("../models/url")
async function handleGenerateShortUrl(req, res) {
    const body = req.body
    if (!body.url) return res.status(400).json({ error: "URL is required" })
    const shortId = nanoid(8)
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
    }

    )
    const allUrls = await URL.find({})
    return res.render("home", { id: shortId, urls: allUrls })
}

async function handleGetById(req, res) {
    const shortId = req.params.shortid
    const allShortData = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    )

    if (!allShortData) return res.status(404).json({ error: "Short URL not found" })

    res.redirect(allShortData.redirectURL)
}

async function handleDataView(req, res) {
    const shortId = req.params.shortid
    const shortHist = await URL.findOne({ shortId })

    if (!shortHist) return res.status(404).json({ error: "Short URL not found" })

    return res.json({
        totalClicks: shortHist.visitHistory.length,
        history: shortHist.visitHistory,
    })
}

module.exports = {
    handleGenerateShortUrl,
    handleGetById,
    handleDataView,

}