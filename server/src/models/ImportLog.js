const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema({
  source: { type: String, required: true },
  totalFetched: { type: Number, default: 0 },
  totalImported: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: { type: Number, default: 0 },
  errors: { type: String, default: '' },
  status: { type: String, enum: ['PENDING','PROCESSING','DONE','FAILED'], default: 'PENDING' },
  startTime: { type: Date },
  endTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ImportLog', importLogSchema);
