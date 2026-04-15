import { Request, Response } from 'express';
import Product from '../models/productModel';

// POST /api/products — create a new product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, category } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = await Product.create({ name, price, description, image, category });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products — get all products, optionally filtered by ?category=Headphones
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    // Build filter — only apply if a valid category string is passed
    const filter = category && typeof category === 'string' ? { category } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 }); // newest first
    res.json(products);
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id — get one product by MongoDB _id (public)
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error in getProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/products/:id — update a product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // return the updated document, not the old one
    );
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/products/:id — delete a product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
