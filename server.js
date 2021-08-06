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

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import autoIncrementFactory from 'mongoose-sequence';
const autoIncrement = autoIncrementFactory(mongoose);

const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: String,
});
urlSchema.plugin(autoIncrement, { inc_field: 'shortUrl' });

const Url = mongoose.model('Url', urlSchema);

const getShortUrl = async (originalUrl) => {
  const url = await Url.findOne({ originalUrl }).exec();
  if (url) {
    return url.shortUrl;
  }

  const newUrl = await Url.create({ originalUrl });
  return newUrl.shortUrl;
};

import validUrl from 'valid-url';

app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;

  console.log(req.body);

  if (!validUrl.isWebUri(originalUrl)) {
    console.log(`Invalid URL: ${originalUrl}`);
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = await getShortUrl(originalUrl);
  console.log(`Short URL: ${shortUrl}`);
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

const getOriginalUrl = async (shortUrl) => {
  const url = await Url.findOne({ shortUrl }).exec();
  return url?.shortUrl;
};

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const originalUrl = await getOriginalUrl(req.params.shortUrl);

  if (!originalUrl) {
    return res.status(404).send('Not Found');
  }

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
