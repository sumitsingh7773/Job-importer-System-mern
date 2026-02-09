const jobQueue = require('./jobQueue');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');
const logger = require('../utils/logger');
jobQueue.process(async (job) => {
  const { importLogId, source, jobs } = job.data;
  const startTime = new Date();

  await ImportLog.findByIdAndUpdate(importLogId, { status: 'PROCESSING', startTime });

  let newJobs = 0, updatedJobs = 0, failedJobs = 0;
  const errors = [];

  for (const jobData of jobs) {
    try {
      const result = await Job.updateOne(
        { externalId: jobData.externalId, source },
        { $set: jobData },
        { upsert: true }
      );

      if (result.upsertedCount > 0) newJobs++;
      else updatedJobs++;
    } catch (err) {
      failedJobs++;
      errors.push(err.message);
    }
  }

  const endTime = new Date();
  await ImportLog.findByIdAndUpdate(importLogId, {
    totalImported: newJobs + updatedJobs,
    newJobs,
    updatedJobs,
    failedJobs,
    errors: errors.join('; '),
    status: failedJobs ? 'FAILED' : 'DONE',
    endTime
  });

  console.log(` Job completed: ${importLogId} | Duration: ${(endTime - startTime)/1000}s`);
});

