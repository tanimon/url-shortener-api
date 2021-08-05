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

const getShortUrl = (originalUrl, done) => {
  Url.findOne({ originalUrl }, (err, url) => {
    if (err) {
      return done(err);
    }
    if (url) {
      return done(null, url.shortUrl);
    }

    Url.create({ originalUrl }, (err, data) => {
      if (err) {
        return done(err);
      }

      done(null, data.shortUrl);
    });
  });
};

import validUrl from 'valid-url';

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  console.log(req.body);

  if (!validUrl.isWebUri(originalUrl)) {
    console.log(`Invalid URL: ${originalUrl}`);
    return res.json({ error: 'invalid url' });
  }

  getShortUrl(originalUrl, (err, shortUrl) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(`Short URL: ${shortUrl}`);
    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  Url.findOne({ shortUrl: req.params.shortUrl }, (err, url) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!url) {
      return res.status(404).send('Not found');
    }

    res.redirect(url.originalUrl);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
