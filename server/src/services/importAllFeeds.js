const jobQueue = require('../queues/jobQueue');
const { fetchJobsFromFeed } = require('./jobFeedService');
const normalizeJob = require('../utils/normalizeJob');
const ImportLog = require('../models/ImportLog');
const logger = require('../utils/logger');
const feeds = [
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

async function importAllFeeds() {
  for (const feedUrl of feeds) {
    try {
      const { items } = await fetchJobsFromFeed(feedUrl);
      const jobs = items.map(item => normalizeJob(item, feedUrl));

      const importLog = await ImportLog.create({
        source: feedUrl,
        totalFetched: jobs.length,
        status: 'PENDING',
      });

      await jobQueue.add({ importLogId: importLog._id, source: feedUrl, jobs });
      console.log(` Feed queued: ${feedUrl}, jobs: ${jobs.length}`);
    } catch (err) {
      console.error(` Failed to fetch or queue feed: ${feedUrl}`, err.message);
    }
  }
}

module.exports = { importAllFeeds };
