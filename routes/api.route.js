import express from 'express';
import { getShortUrl, getOriginalUrl } from '../controllers/url.controller.js';

const router = express.Router();

router.post('/shorturl', getShortUrl);
router.get('/shorturl/:shortUrl', getOriginalUrl);

export default router;
