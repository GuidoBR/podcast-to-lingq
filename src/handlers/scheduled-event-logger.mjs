/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import Parser from 'rss-parser';

async function readRssFeed(feedUrl) {
  const parser = new Parser();

  return await parser.parseURL(feedUrl);
}

function isToday (date) {  
  const now = new Date()
  return date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
}

export const scheduledEventLoggerHandler = async (event, context) => {
    console.info(JSON.stringify(event));

    const podcast_feed_url = "https://innerfrench.com/feed/"

    let feed;
    let feed_links = [];
    let feed_titles = [];
  
    feed = await readRssFeed(podcast_feed_url);
    if (!feed){
      console.log('Failed to get RSS');
      return [];
    }
  
    feed.items.forEach((item) => {
      publishedDate = new Date(item.pubDate);
      if (isToday(pubDate)) {
        console.log(item);
        feed_titles.push(item.title);
        feed_links.push(item.link);
      }
    });

    console.log(feed.items);
}
