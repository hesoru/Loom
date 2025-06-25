const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const CategoryProduct = require('../models/CategoryProduct');
const ProductAttribute = require('../models/ProductAttribute');
const ProductAttributePrice = require('../models/ProductAttributePrice');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    
    // Apply category filter if provided
    if (category) {
      filter.category = category;
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get products by category name
// @route   GET /api/products/category/:categoryName
// @access  Public
router.get('/category/:categoryName', async (req, res) => {
  try {
    // Get and decode the category name from URL parameter
    const categoryName = decodeURIComponent(req.params.categoryName);
    console.log('Category name (decoded):', categoryName);
    
    // First find the category by name
    const category = await Category.findOne({ name: categoryName });
    
    if (!category) {
      console.log(`Category not found: ${categoryName}`);
      return res.status(404).json({ message: 'Category not found' });
    }
    
    console.log('Found category:', category);
    
    // Then find all CategoryProduct entries for this category
    const categoryProducts = await CategoryProduct.find({ categoryId: category._id });
    const productIds = categoryProducts.map(cp => cp.productId);
    
    // Finally get all products with these IDs
    const products = await Product.find({ _id: { $in: productIds } });
    
    console.log(`Found ${products.length} products for category ${categoryName}`);
    res.json(products);
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Split the search query into individual terms
    const searchTerms = q.trim().split(/\s+/);
    console.log('Search terms:', searchTerms);
    
    if (searchTerms.length === 0) {
      return res.json([]);
    }
    
    // Create regex patterns for search terms
    const regexPatterns = searchTerms.map(term => new RegExp(term, 'i'));
    
    // Step 1: Find products that match name or description
    const basicConditions = searchTerms.map(term => ({
      $or: [
        { name: { $regex: new RegExp(term, 'i') } },
        { description: { $regex: new RegExp(term, 'i') } }
      ]
    }));
    
    const basicProducts = await Product.find({ $and: basicConditions });
    const basicProductIds = basicProducts.map(p => p._id.toString());
    console.log(`Found ${basicProductIds.length} products matching basic fields`);
    
    // Step 2: Find products by category
    const matchingCategories = await Category.find({
      name: { $in: regexPatterns }
    });
    console.log('Matching categories:', matchingCategories.map(c => c.name));
    
    const categoryProductLinks = await CategoryProduct.find({
      categoryId: { $in: matchingCategories.map(c => c._id) }
    });
    
    const categoryProductIds = categoryProductLinks.map(cp => cp.productId.toString());
    console.log(`Found ${categoryProductIds.length} products in matching categories`);
    
    // Step 3: Find products by attribute values (like sizes)
    const matchingAttributes = await ProductAttribute.find({
      attributeValue: { $in: regexPatterns }
    });
    
    const attributeProductIds = matchingAttributes.map(attr => attr.productId.toString());
    console.log(`Found ${attributeProductIds.length} products with matching attributes`);
    
    // Combine all product IDs
    const allProductIds = [...new Set([...basicProductIds, ...categoryProductIds, ...attributeProductIds])];
    console.log(`Found ${allProductIds.length} total unique products`);
    
    if (allProductIds.length === 0) {
      return res.json([]);
    }
    
    // Fetch all matching products
    const products = await Product.find({
      _id: { $in: allProductIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    
    // For each product, fetch its categories and attributes
    const productsWithDetails = [];
    
    for (const product of products) {
      // Get categories
      const productCategories = await CategoryProduct.find({
        productId: product._id
      }).populate('categoryId');
      
      const categories = productCategories
        .filter(cp => cp.categoryId)
        .map(cp => cp.categoryId.name);
      
      // Get attributes
      const attributes = await ProductAttribute.find({ productId: product._id });
      const attributeValues = attributes.map(attr => attr.attributeValue);
      
      // Check if all search terms match this product
      const matchesAllTerms = searchTerms.every(term => {
        const regex = new RegExp(term, 'i');
        
        // Check if term matches product name or description
        if (regex.test(product.name) || regex.test(product.description)) {
          return true;
        }
        
        // Check if term matches any category
        if (categories.some(category => regex.test(category))) {
          return true;
        }
        
        // Check if term matches any attribute
        if (attributeValues.some(value => regex.test(value))) {
          return true;
        }
        
        return false;
      });
      
      if (matchesAllTerms) {
        productsWithDetails.push({
          ...product.toObject(),
          categories,
          attributes: attributeValues
        });
      }
    }
    
    console.log(`Search for "${q}" found ${productsWithDetails.length} products after filtering`);
    res.json(productsWithDetails);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get product attributes with prices
// @route   GET /api/products/:id/attributes
// @access  Public
router.get('/:id/attributes', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Fetching attributes for product ID:', productId);
    
    // Check if product exists
    const product = await Product.findById(productId);
    console.log('Product found:', product ? 'Yes' : 'No');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get all attribute prices for this product with populated attribute data
    const attributePrices = await ProductAttributePrice.find({ productId })
      .populate('attributeId')
      .populate('productId');
    
    console.log(`Found ${attributePrices.length} attribute prices for product ${productId}`);
    
    // Format the response
    const formattedAttributes = attributePrices.map(attrPrice => ({
      _id: attrPrice._id,
      attribute: attrPrice.attributeId,
      price: attrPrice.price
    }));
    
    res.json(formattedAttributes);
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, image, price, attributes } = req.body;
    
    const product = new Product({
      name,
      description,
      image,
      price
    });
    
    const createdProduct = await product.save();
    
    // If attributes are provided, create them along with their prices
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        const productAttribute = new ProductAttribute({
          productId: createdProduct._id,
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue
        });
        
        const savedAttribute = await productAttribute.save();
        
        const attributePrice = new ProductAttributePrice({
          productId: createdProduct._id,
          attributeId: savedAttribute._id,
          price: attr.price || price
        });
        
        await attributePrice.save();
      }
    }
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.image = image || product.image;
      product.price = price || product.price;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Delete all associated attributes and prices
      await ProductAttribute.deleteMany({ productId: product._id });
      await ProductAttributePrice.deleteMany({ productId: product._id });
      
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
