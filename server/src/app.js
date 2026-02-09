require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongo = require("./config/mongo");

require("./queue/jobWorker");
require("./cron/fetchFeeds");

const importLogs = require("./routes/importLogs");
const jobRoutes = require("./routes/jobs"); 

const app = express();
connectMongo();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/import-logs", importLogs);
app.use("/api/jobs", jobRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);
