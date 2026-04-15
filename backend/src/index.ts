import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import connectDB from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from the Vite dev server
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use('/api', router);
    
    // Simple root route to show API is running
    app.get('/', (_req, res) => {
      res.send('API running. Try GET /api/health');
    });

const start = async () => {
  try {
    await connectDB();
    app.listen(Number(port), () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
