/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import Parser from 'rss-parser';

async function readRssFeed(feedUrl) {
  const parser = new Parser();

  return await parser.parseURL(feedUrl);
}

export const scheduledEventLoggerHandler = async (event, context) => {
    console.info(JSON.stringify(event));

    const podcast_feed_url = "https://innerfrench.com/feed/"

    let feed;
    let feed_links = [];
  
    feed = await readRssFeed(podcast_feed_url);
    if (!feed){
      console.log('Failed to get RSS');
      return [];
    }
  
    feed.items.forEach((item) => {
      console.log(item);
      feed_titles.push(item.title);
      feed_links.push(item.link);
    });

    console.log(feed_links);
    return feed_links;

}
