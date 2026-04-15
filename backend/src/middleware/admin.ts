import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

export const admin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: 'User not found' });
  if (!user.isAdmin) return res.status(403).json({ message: 'Admin privileges required' });

  next();
};

export default admin;
