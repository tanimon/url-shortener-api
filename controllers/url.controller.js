import { url as urlRepo } from '../repositories/mongo/mongo.repository.js';
import validUrl from 'valid-url';

export const getShortUrl = async (req, res) => {
  const originalUrl = req.body.url;

  console.log(req.body);

  if (!validUrl.isWebUri(originalUrl)) {
    console.log(`Invalid URL: ${originalUrl}`);
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = await urlRepo.getShortUrl(originalUrl);
  console.log(`Short URL: ${shortUrl}`);
  res.json({ original_url: originalUrl, short_url: shortUrl });
};

export const redirectToOriginalUrl = async (req, res) => {
  const shortUrl = req.params.shortUrl;
  console.log(`Short URL: ${shortUrl}`);

  const originalUrl = await urlRepo.getOriginalUrl(shortUrl);
  console.log(`Original URL: ${originalUrl}`);

  if (!originalUrl) {
    return res.status(404).send('Not Found');
  }

  res.redirect(originalUrl);
};
