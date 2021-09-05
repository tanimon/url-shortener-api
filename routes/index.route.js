import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

export default router;
