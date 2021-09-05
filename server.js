import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index.route.js';
import apiRouter from './routes/api.route.js';

dotenv.config();
const app = express();

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
