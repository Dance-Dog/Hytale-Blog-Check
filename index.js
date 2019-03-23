'use strict';

//HTTPS & options
const https = require('https');
const options = {
  protocol: 'https:',
  hostname: 'hytale.com',
  port: 443,
  path: '/api/blog/post/published',
  method: 'GET',
  headers: {'User-Agent': 'Hytale BlogCheck'}
};

//Run
var latestPost = {};

function run() {
  console.log('oh')
  const req = https.request(options, res => {
    console.log('oh2')
    var body = '';
    res.on('data', chunk => body+=chunk);
    res.on('end', () => {
      let isNew = handleBody(body);
      console.log(isNew)
      if (isNew) {
        console.log('New blog post: ' + JSON.stringify(latestPost,null,2));
        //do something

        /*Sample function to get post url:

        function getUrl(post) {
          const published = new Date(post.publishedAt);
          return `https://hytale.com/news/${published.getFullYear()}/${published.getMonth()+1}/${post.slug}`;
        }*/
      }
    });
  });
  req.end();
}

//Handle response body
function handleBody(body) {
  try {
    var posts = JSON.parse(body);
    if (posts[0]) {
      if (Object.keys(latestPost).length == 0) {
        latestPost = posts[0];
        return false;
      }
      if (posts[0].slug !== latestPost.slug) {
        latestPost = posts[0];
        return true;
      }
      return false;
    }
  } catch (err) {return false}
}

//Run & loop ever x minutes
var x = 30;

run();
setInterval(run, x*60*1000);
