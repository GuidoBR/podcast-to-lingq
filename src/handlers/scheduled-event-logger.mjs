/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import Parser from 'rss-parser';
import axios from 'axios';


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

    const podcast_feed_url = "https://innerfrench.com/feed/";
    const lingq_api_url = "https://www.lingq.com/api/v2/fr/lessons/"; // https://www.lingq.com/apidocs/api-2.0.html#lessons

    let feed;
  
    feed = await readRssFeed(podcast_feed_url);
    if (!feed){
      console.log('Failed to get RSS');
      return [];
    }
  
    feed.items.forEach((item) => {
      let publishedDate = new Date(item.pubDate);
      if (isToday(publishedDate)) {
        console.log("Publishing item into LingQ:", item);

        axios.post(lingq_api_url, {
          title: item.title,
          status: "private",
          level: 4, // Intermediate 2
          original_url: item.link,
          text: item.description,
          audio: item.enclosure.url
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    });

    console.log(feed.items);
}
