import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as urlModel from './models/url.model.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const url = { ...urlModel };
