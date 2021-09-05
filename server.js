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

import { getShortUrl, getOriginalUrl } from './controllers/url.controller.js';

app.post('/api/shorturl', getShortUrl);
app.get('/api/shorturl/:shortUrl', getOriginalUrl);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
