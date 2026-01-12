require("dotenv").config();
const express = require("express");
const connectMongo = require("./config/mongo");

require("./queue/jobWorker");
require("./cron/fetchFeeds");

const importLogs = require("./routes/importLogs");

const app = express();
connectMongo();

app.use("/import-logs", importLogs);

app.listen(5000, () => console.log("Server running on port 5000"));
