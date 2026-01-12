const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  externalId: { type: String, index: true },
  source: { type: String, index: true },
  title: String,
  company: String,
  location: String,
  description: String,
}, { timestamps: true });

JobSchema.index({ externalId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('Job', JobSchema);
