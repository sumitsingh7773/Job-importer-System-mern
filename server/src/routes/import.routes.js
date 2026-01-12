const express = require('express');
const ImportLog = require('../models/ImportLog');

const router = express.Router();

router.get('/', async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ImportLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ImportLog.countDocuments()
  ]);

  res.json({ data, total });
});

module.exports = router;
