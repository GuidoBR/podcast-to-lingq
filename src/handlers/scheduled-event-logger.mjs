/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */
export const scheduledEventLoggerHandler = async (event, context) => {
    console.info(JSON.stringify(event));

    var FeedParser = require('feedparser');
    var fetch = require('node-fetch'); // for fetching the feed

    const podcast_feed_url = "https://innerfrench.com/feed/"
    var req = fetch(podcast_feed_url)
    var feedparser = new FeedParser([options]);

    req.then(function (res) {
        if (res.status !== 200) {
          throw new Error('Error on retrieving the feed url');
        }
        else {
          // The response `body` -- res.body -- is a stream
          res.body.pipe(feedparser);
        }
      }, function (err) {
        throw new Error('Error on downloading the feed');
      });

      feedparser.on('error', function (error) {
        throw new Error('Error on feedparser');
      });

      feedparser.on('readable', function () {
        // This is where the action is!
        var stream = this; // `this` is `feedparser`, which is a stream
        var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;

        while (item = stream.read()) {
          console.log(item);
        }
      });
}
