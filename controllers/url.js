const { nanoid } = require("nanoid") // import the library which generates the short links
const URL = require("../models/url") // importing the model which holds the schema of DB

//Method 1: to generate the Short Links
async function handleGenerateShortUrl(req, res) {
  const body = req.body //parse and get the data from postman body tab.
  if (!body.url) return res.status(400).json({ error: "URL is required" }) //checks body if it is empty or not
  const shortId = nanoid(8) //sets the numbers of character in short link
  await URL.create({
    //creates the new object with a short link
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  })
  const allUrls = await URL.find({}) //gets all the entries in the DB
  return res.render("home", {
    id: shortId,
    urls: allUrls,
  }) /*renders the EJS view file called "home" and provides the id and urls to use in the view UI  */
}

//Method 2: which redirects the entry using ID and adds the history of clicks
async function handleGetById(req, res) {
  const shortId = req.params.shortid
  const allShortData = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  )

  if (!allShortData)
    return res.status(404).json({ error: "Short URL not found" })

  res.redirect(allShortData.redirectURL)
}

//Method 3: returns the analytics of an entry
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
