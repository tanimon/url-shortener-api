import mongoose from 'mongoose';
import autoIncrementFactory from 'mongoose-sequence';

const autoIncrement = autoIncrementFactory(mongoose);
const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: String,
}).plugin(autoIncrement, { inc_field: 'shortUrl' });

const Url = mongoose.model('Url', urlSchema);

/**
 * @description Get the short url corresponding to the original url
 * @param {String} originalUrl The original url
 * @returns {Promise<String>} Promise with the short url retrieved from the database when exists, or the new short url created
 */
export const getShortUrl = async (originalUrl) => {
  const url = await Url.findOne({ originalUrl }).exec();
  if (url) {
    return url.shortUrl;
  }

  const newUrl = await Url.create({ originalUrl });
  return newUrl.shortUrl;
};

/**
 * @description Get the original url corresponding to the short url
 * @param {String} shortUrl The short url
 * @returns {Promise<String>} Promise with the original url retrieved from the database when exists, or null
 */
export const getOriginalUrl = async (shortUrl) => {
  const url = await Url.findOne({ shortUrl }).exec();
  return url?.originalUrl;
};
