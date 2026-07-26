const mongoose = require("mongoose") // imports mongoose to create the schema

//creates the schema
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
)

//names the Model and assign it a schema
const URL = mongoose.model("url", urlSchema)

module.exports = URL
