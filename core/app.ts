import express, { Express, Request, Response, NextFunction } from 'express';
import userRoutes from '../routes/userRoutes';
import '../config/firebaseConfig';

const app: Express = express();
const port = process.env.PORT || 3000;

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


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
