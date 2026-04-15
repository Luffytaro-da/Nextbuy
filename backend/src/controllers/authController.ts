import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const jwtSecret = process.env.JWT_SECRET || 'secret';

// POST /api/auth/register
// Body: { name, email, password, adminCode? }
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before saving (salt factor 10 is standard)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Allow admin creation only if a valid admin code is provided
    const adminCode = req.body.adminCode as string | undefined;
    const isAdmin = Boolean(
      adminCode && process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE
    );

    const user = await User.create({ name, email, password: hash, isAdmin });

    // Sign a JWT that expires in 7 days
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
// Body: { email, password }
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Generic message — don't reveal whether email exists
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare submitted password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
