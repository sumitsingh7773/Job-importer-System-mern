const axios = require('axios');
const xml2js = require('xml2js');
const { jobQueue } = require('../queues/jobQueue');

const parser = new xml2js.Parser({ explicitArray: false });

const jobFeeds = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

async function fetchAndQueueJobs() {
  for (const url of jobFeeds) {
    try {
      const response = await axios.get(url);
      const data = await parser.parseStringPromise(response.data);

      const jobs = data.rss.channel.item || [];

      console.log(`Fetched ${jobs.length} jobs from ${url}`);

      for (const job of jobs) {
        await jobQueue.add('import-job', {
          sourceUrl: url,
          job
        });
      }

    } catch (err) {
      console.error(`Failed to fetch jobs from ${url}`, err.message);
    }
  }
}

module.exports = { fetchAndQueueJobs };
