const express = require("express");
const { connectToMongoDb } = require("./connect");
const app = express();
const urlRoute = require("./routes/url");
const URL = require("./model/url");
const PORT = 8001;
connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("mongo db connected");
});
app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: {timestamp:Date.now(),} } }
  );
  res.redirect(entry.redirectUrl)
});
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
