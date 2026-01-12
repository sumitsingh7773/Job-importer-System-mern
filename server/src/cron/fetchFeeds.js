const cron = require("node-cron");
const { processFeed } = require("../services/feedService");

const feeds = [
  "https://jobicy.com/?feed=job_feed",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

cron.schedule("0 * * * *", async () => {
  for (const feed of feeds) {
    await processFeed(feed);
  }
});
