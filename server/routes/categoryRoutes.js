const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Category = require('../models/Category');
const CategoryProduct = require('../models/CategoryProduct');
const Product = require('../models/Product');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get products by category name
// @route   GET /api/categories/:categoryName/products
// @access  Public
router.get('/:categoryName/products', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    console.log(categoryName);
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });
    console.log(category);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Find all products in this category using the CategoryProduct relationship
    const categoryProducts = await CategoryProduct.find({ categoryId: category._id });
    const productIds = categoryProducts.map(cp => cp.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // @desc    Fetch single category
// // @route   GET /api/categories/:id
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
    
//     if (category) {
//       // Get all products in this category
//       const categoryProducts = await CategoryProduct.find({ categoryId: category._id });
//       const productIds = categoryProducts.map(cp => cp.productId);
//       const products = await Product.find({ _id: { $in: productIds } });
      
//       res.json({
//         ...category.toObject(),
//         products
//       });
//     } else {
//       res.status(404).json({ message: 'Category not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = new Category({
      name,
      description
    });
    
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Add product to category
// @route   POST /api/categories/:id/products
// @access  Private
router.post('/:id/products', async (req, res) => {
  try {
    const { productId } = req.body;
    const categoryId = req.params.id;
    
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if relationship already exists
    const existingRelation = await CategoryProduct.findOne({ categoryId, productId });
    if (existingRelation) {
      return res.status(400).json({ message: 'Product already in this category' });
    }
    
    const categoryProduct = new CategoryProduct({
      categoryId,
      productId
    });
    
    await categoryProduct.save();
    res.status(201).json({ message: 'Product added to category' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Remove product from category
// @route   DELETE /api/categories/:id/products/:productId
// @access  Private
router.delete('/:id/products/:productId', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const productId = req.params.productId;
    
    const result = await CategoryProduct.deleteOne({ categoryId, productId });
    
    if (result.deletedCount > 0) {
      res.json({ message: 'Product removed from category' });
    } else {
      res.status(404).json({ message: 'Product not found in this category' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      // Delete all category-product relationships
      await CategoryProduct.deleteMany({ categoryId: category._id });
      
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
