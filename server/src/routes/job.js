const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (err) {
    console.error("Jobs API error:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

module.exports = router;
