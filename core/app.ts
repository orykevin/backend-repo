import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import userRoutes from '../routes/userRoutes';
import '../config/firebaseConfig';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Express + TypeScript Server with Firebase Integration is running.');
});

app.use('/api/user', userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Not Found: The requested endpoint does not exist.' });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.stack || err);
  res.status(500).send({
    message: 'Internal Server Error',
  });
});

export default app