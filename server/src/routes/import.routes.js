const express = require("express");
const ImportLog = require("../models/ImportLog");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 }).lean();

    const normalizedLogs = logs.map(log => ({
      ...log,
      _id: log._id.toString(),                    
      createdAt: log.createdAt.toISOString(),     
      updatedAt: log.updatedAt.toISOString(),     
      status: log.status?.toUpperCase() || "PENDING", 
    }));

    res.json(normalizedLogs);
  } catch (err) {
    console.error("Failed to fetch import logs:", err);
    res.status(500).json({ error: "Failed to fetch import logs" });
  }
});

module.exports = router;
