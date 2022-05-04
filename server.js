require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const { createAndSaveUrl, getUrl } = require('./dataaccess/urlDB.js');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
// app.get('/api/hello', function(req, res) {
//   createAndSaveUrl("https://replit.com/@DanielChoi19/url-shortener-nodejs#server.js");
//   res.json({ greeting: 'hello API' });
// });

app.get('/api/shorturl/:url', async (req, res) => {
  const url = req.params.url;
  const urlObj = await getUrl(url);
  const oriurl = urlObj.original_url;
  res.redirect(oriurl);

  
})

app.post('/api/shorturl', (req, res) => {
  const shorturl = req.body.url;
  const urlObject = new URL(shorturl);
  // console.log(shorturl.replace(urlRegex, ""))

  dns.lookup(urlObject.hostname, (err, address, family) => {
    console.log(err);
    if (err) return res.json({ error: 'invalid url' });

    const savedurl = createAndSaveUrl(shorturl);
    res.json(savedurl);
  })


});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
