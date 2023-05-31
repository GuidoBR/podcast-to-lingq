/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import { feedparser } from 'feedparser';
import fetch from 'node-fetch';

export const scheduledEventLoggerHandler = async (event, context) => {
    console.info(JSON.stringify(event));

    const podcast_feed_url = "https://innerfrench.com/feed/"
    var req = fetch(podcast_feed_url)
    var feed = new FeedParser();

    req.then(function (res) {
        if (res.status !== 200) {
          throw new Error('Error on retrieving the feed url');
        }
        else {
          // The response `body` -- res.body -- is a stream
          res.body.pipe(feed);
        }
      }, function (err) {
        throw new Error('Error on downloading the feed');
      });

      feed.on('error', function (error) {
        throw new Error('Error on feedparser');
      });

      feed.on('readable', function () {
        // This is where the action is!
        var stream = this; // `this` is `feedparser`, which is a stream
        var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;

        while (item = stream.read()) {
          console.log(item);
        }
      });
}
