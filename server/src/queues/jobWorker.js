const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Job = require("../models/Job");

new Worker(
  "job-import-queue",
  async (job) => {
    const { jobData, source } = job.data;

    await Job.updateOne(
      { externalId: jobData.guid, source },
      {
        $set: {
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
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY || 5)
  }
);
