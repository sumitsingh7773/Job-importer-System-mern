const axios = require("axios");
const xml2js = require("xml2js");
const jobQueue = require("../queue/jobQueue");
const ImportLog = require("../models/ImportLog");

const fetchFeed = async (url) => {
  const res = await axios.get(url);
  return xml2js.parseStringPromise(res.data, { explicitArray: false });
};

const processFeed = async (url) => {
  const log = await ImportLog.create({ fileName: url });

  const data = await fetchFeed(url);
  const jobs = data.rss.channel.item || [];

  let failedJobs = [];

  for (const job of jobs) {
    try {
      await jobQueue.add("import", {
        jobData: job,
        source: url
      });
    } catch (err) {
      failedJobs.push({ jobId: job.guid, reason: err.message });
    }
  }

  await ImportLog.updateOne(
    { _id: log._id },
    {
      totalFetched: jobs.length,
      totalImported: jobs.length - failedJobs.length,
      failedJobs
    }
  );
};

module.exports = { processFeed };
