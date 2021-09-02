import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

import { url as urlRepo } from './repositories/mongo/mongo.repository.js';
import validUrl from 'valid-url';

app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;

  console.log(req.body);

  if (!validUrl.isWebUri(originalUrl)) {
    console.log(`Invalid URL: ${originalUrl}`);
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = await urlRepo.getShortUrl(originalUrl);
  console.log(`Short URL: ${shortUrl}`);
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shortUrl', async (req, res) => {
  const originalUrl = await urlRepo.getOriginalUrl(req.params.shortUrl);

  if (!originalUrl) {
    return res.status(404).send('Not Found');
  }

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
