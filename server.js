import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

//routers
import jobRouter from './routes/jobRouter.js';
import userRouter from './routes/userRouter.js';

//public
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

const app = express();

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './public')));

app.use(cookieParser());
app.use(express.json());

//dummy route
app.use('/api/v1/test', (req, res) => {
  res.json({message: 'test route'});
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', userRouter);

//GENERIC NOT FOUND
app.use('*', (req, res, next) => {
  res.status(404).json({ message: 'custom not found'});
});

//ERROR
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on port ${port} ... `);
  });  
} catch (error) {
  console.log(error);
  process.exit(1);
}
