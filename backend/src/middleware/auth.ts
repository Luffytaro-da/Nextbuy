import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  userId?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
