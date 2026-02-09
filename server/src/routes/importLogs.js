const express = require("express");
const ImportLog = require("../models/ImportLog");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ createdAt: -1 }).lean();

    const normalizedLogs = logs.map(log => ({
      _id: log._id.toString(),
      source: log.source || "",
      totalFetched: log.totalFetched ?? 0,
      totalImported: log.totalImported ?? 0,
      newJobs: log.newJobs ?? 0,
      updatedJobs: log.updatedJobs ?? 0,
      failedJobs: log.failedJobs ?? 0,
      status: (log.status || "PENDING").toUpperCase(),
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    }));

    res.json(normalizedLogs);
  } catch (err) {
    console.error("Failed to fetch import logs:", err);
    res.status(500).json({ error: "Failed to fetch import logs" });
  }
});

module.exports = router;
