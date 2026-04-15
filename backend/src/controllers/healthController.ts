import { Request, Response } from 'express';

// GET /api/health — simple ping to check if the server is running
export const health = (_req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      message: 'NextBuy API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
