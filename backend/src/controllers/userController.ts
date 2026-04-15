import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';

// GET /api/me — returns the currently logged-in user's data (password excluded)
// Requires: auth middleware (sets req.userId from JWT)
export const me = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in GET /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/me — update the logged-in user's profile
// Body: { name?, email?, password? }
export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, password } = req.body;

    // Update only fields that were provided
    if (name && name.trim()) user.name = name.trim();
    if (email && email.trim()) user.email = email.trim();

    // Hash new password only if provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    const updated = await user.save();

    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
    });
  } catch (err: any) {
    // Duplicate email (unique index violation)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email is already in use by another account.' });
    }
    console.error('Error in PUT /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
