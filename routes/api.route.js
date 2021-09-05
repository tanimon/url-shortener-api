import express from 'express';
import {
  getShortUrl,
  redirectToOriginalUrl,
} from '../controllers/url.controller.js';

const router = express.Router();

router.post('/shorturl', getShortUrl);
router.get('/shorturl/:shortUrl', redirectToOriginalUrl);

export default router;
