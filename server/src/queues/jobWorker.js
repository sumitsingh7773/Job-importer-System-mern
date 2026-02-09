const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");

new Worker(
  "job-import-queue",
  async (job) => {
    const { jobData, source, importLogId } = job.data;

    try {
      const result = await Job.updateOne(
        { externalId: jobData.guid, source },
        {
          $set: {
            externalId: jobData.guid,
            title: jobData.title,
            company: jobData["job:company"],
            location: jobData["job:location"],
            url: jobData.link,
            source,
            raw: jobData
          }
        },
        { upsert: true }
      );

      // NEW JOB
      if (result.upsertedCount > 0) {
        await ImportLog.findByIdAndUpdate(importLogId, {
          $inc: { newJobs: 1, totalImported: 1 }
        });
      }
      // UPDATED JOB
      else if (result.modifiedCount > 0) {
        await ImportLog.findByIdAndUpdate(importLogId, {
          $inc: { updatedJobs: 1, totalImported: 1 }
        });
      }

    } catch (err) {
      // FAILED JOB
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { failedJobs: 1 },
        $push: { errors: err.message }
      });

      throw err; // BullMQ retry support
    }
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY || 5)
  }
);
