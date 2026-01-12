const axios = require('axios');
const xml2js = require('xml2js');

async function fetchJobsFromFeed(feedUrl) {
  try {
    const response = await axios.get(feedUrl);
    let xml = response.data;

    xml = xml.replace(/=\s*>/g, '="">');

    const parser = new xml2js.Parser({ explicitArray: false });
    const json = await parser.parseStringPromise(xml);

    const items = json?.rss?.channel?.item || [];

    return { items, feedUrl };
  } catch (err) {
    console.error(`Failed to fetch or parse feed: ${feedUrl}`, err.message);
    return { items: [], feedUrl }; 
  }
}

module.exports = { fetchJobsFromFeed };
