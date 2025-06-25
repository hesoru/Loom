const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Import models
const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');
const ProductAttribute = require('../models/ProductAttribute');
const ProductAttributePrice = require('../models/ProductAttributePrice');

// @desc    Get all carts (admin function)
// @route   GET /api/cart
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    // Find all shopping carts
    const carts = await ShoppingCart.find();
    
    // Populate product details for each cart
    const populatedCarts = await Promise.all(carts.map(async (cart) => {
      // Populate items in each cart
      const populatedItems = await Promise.all(cart.items.map(async (item) => {
        // Get the product attribute price details
        const attributePrice = await ProductAttributePrice.findById(item.productAttributePriceId)
          .populate('productId')
          .populate('attributeId');
        
        if (!attributePrice) {
          return {
            ...item.toObject(),
            product: null,
            attribute: null,
            price: 0
          };
        }
        
        return {
          ...item.toObject(),
          product: attributePrice.productId,
          attribute: attributePrice.attributeId,
          price: attributePrice.price
        };
      }));
      
      // Calculate total price for the cart
      const total = populatedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      return {
        ...cart.toObject(),
        items: populatedItems,
        total
      };
    }));
    
    res.json(populatedCarts);
  } catch (error) {
    console.error('Error fetching all carts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get cart by session ID
// @route   GET /api/cart/:sessionId
// @access  Public
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ sessionId: req.params.sessionId });
    
    if (cart) {
      // Populate product details for each item in the cart
      const populatedItems = await Promise.all(cart.items.map(async (item) => {
        // Get the product attribute price details
        const attributePrice = await ProductAttributePrice.findById(item.productAttributePriceId)
          .populate('productId')
          .populate('attributeId');
        
        if (!attributePrice) {
          return {
            ...item.toObject(),
            product: null,
            attribute: null,
            price: 0
          };
        }
        
        return {
          ...item.toObject(),
          product: attributePrice.productId ? {
            _id: attributePrice.productId._id,
            name: attributePrice.productId.name,
            image: attributePrice.productId.image
          } : null,
          attribute: attributePrice.attributeId ? {
            attributeName: attributePrice.attributeId.attributeName,
            attributeValue: attributePrice.attributeId.attributeValue
          } : null,
          price: attributePrice.price
        };
      }));
      
      // Calculate the total price
      const total = populatedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      res.json({
        _id: cart._id,
        sessionId: cart.sessionId,
        items: populatedItems,
        total: total,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      });
    } else {
      // Create a new cart if one doesn't exist
      const newCart = await ShoppingCart.create({
        sessionId: req.params.sessionId,
        items: []
      });
      
      res.json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new cart
// @route   POST /api/cart
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Generate a unique session ID
    const sessionId = uuidv4();
    
    const cart = new ShoppingCart({
      sessionId,
      items: []
    });
    
    const createdCart = await cart.save();
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/:sessionId/items
// @access  Public
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { productAttributePriceId, quantity = 1 } = req.body;
    const sessionId = req.params.sessionId;
    
    console.log('Adding to cart:', { sessionId, productAttributePriceId, quantity });
    
    // Find or create cart
    let cart;
    try {
      console.log('Looking for cart with sessionId:', sessionId);
      cart = await ShoppingCart.findOne({ sessionId });
      console.log('Found cart:', cart);
    } catch (error) {
      console.error('Error finding cart:', error);
      return res.status(500).json({ message: 'Error finding cart', error: error.message });
    }

    if (!cart) {
      try {
        console.log('Creating new cart for session:', sessionId);
        cart = await ShoppingCart.create({
          sessionId,
          items: []
        });
        console.log('Cart created successfully:', cart);
      } catch (error) {
        console.error('Error creating cart:', error);
        return res.status(500).json({ message: 'Error creating cart', error: error.message });
      }
    }
    console.log('Cart after find/create step:', cart);
    
    // Find the product attribute price
    if (!productAttributePriceId) {
      return res.status(400).json({ message: 'productAttributePriceId is required' });
    }
    
    console.log('Looking up product attribute price with ID:', productAttributePriceId);
    
    // Convert string ID to ObjectId if needed
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(productAttributePriceId);
    } catch (error) {
      console.error('Invalid ObjectId format:', error);
      return res.status(400).json({ message: 'Invalid productAttributePriceId format' });
    }
    
    let attributePrice;
    try {
      attributePrice = await ProductAttributePrice.findById(objectId)
        .populate('productId')
        .populate('attributeId');
    } catch (error) {
      console.error('Error finding product attribute price:', error);
      return res.status(400).json({ message: 'Error retrieving product attribute price' });
    }
    
    if (!attributePrice) {
      return res.status(404).json({ message: 'Product attribute price not found' });
    }
    
    console.log('Found attribute price:', attributePrice);
    
    const productId = attributePrice.productId._id;
    const attributeId = attributePrice.attributeId._id;
    const price = attributePrice.price;
    
    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productAttributePriceId.toString() === productAttributePriceId
    );
    
    console.log('Checking if item exists in cart:', { existingItemIndex });
    
    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      console.log('Updating existing item quantity');
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item to cart
      console.log('Adding new item to cart with productAttributePriceId:', productAttributePriceId);
      cart.items.push({
        productAttributePriceId: objectId, // Use the ObjectId we created
        quantity: quantity || 1
      });
    }
    
    try {
      console.log('Saving cart with items:', cart.items);
      const updatedCart = await cart.save();
      console.log('Cart saved successfully:', updatedCart);
      
      // Populate the cart items with product details before returning
      const populatedItems = await Promise.all(updatedCart.items.map(async (item) => {
        // Get the product attribute price details
        const attributePrice = await ProductAttributePrice.findById(item.productAttributePriceId)
          .populate('productId')
          .populate('attributeId');
        
        if (!attributePrice) {
          return {
            ...item.toObject(),
            product: null,
            attribute: null,
            price: 0
          };
        }
        
        return {
          ...item.toObject(),
          product: attributePrice.productId ? {
            _id: attributePrice.productId._id,
            name: attributePrice.productId.name,
            image: attributePrice.productId.image
          } : null,
          attribute: attributePrice.attributeId ? {
            attributeName: attributePrice.attributeId.attributeName,
            attributeValue: attributePrice.attributeId.attributeValue
          } : null,
          price: attributePrice.price
        };
      }));
      
      // Calculate the total price
      const total = populatedItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      // Return the populated cart with total
      res.status(201).json({
        _id: updatedCart._id,
        sessionId: updatedCart.sessionId,
        items: populatedItems,
        total: total,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt
      });
    } catch (saveError) {
      console.error('Error saving cart:', saveError);
      res.status(500).json({ message: 'Error saving cart', error: saveError.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:sessionId/items/:itemId
// @access  Public
router.put('/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const quantity = req.body.quantity;  // Extract quantity from request body
    
    console.log('Request body:', req.body);
    
    const cart = await ShoppingCart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    console.log('Updating item quantity:', { itemId, oldQuantity: cart.items[itemIndex].quantity, newQuantity: quantity });
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    
    const updatedCart = await cart.save();
    
    // Populate the cart items with product details before returning
    const populatedItems = await Promise.all(updatedCart.items.map(async (item) => {
      // Get the product attribute price details
      const attributePrice = await ProductAttributePrice.findById(item.productAttributePriceId)
        .populate('productId')
        .populate('attributeId');
      
      if (!attributePrice) {
        return {
          ...item.toObject(),
          product: null,
          attribute: null,
          price: 0
        };
      }
      
      return {
        ...item.toObject(),
        product: attributePrice.productId ? {
          _id: attributePrice.productId._id,
          name: attributePrice.productId.name,
          image: attributePrice.productId.image
        } : null,
        attribute: attributePrice.attributeId ? {
          attributeName: attributePrice.attributeId.attributeName,
          attributeValue: attributePrice.attributeId.attributeValue
        } : null,
        price: attributePrice.price
      };
    }));
    
    // Return the populated cart
    res.json({
      _id: updatedCart._id,
      sessionId: updatedCart.sessionId,
      items: populatedItems,
      createdAt: updatedCart.createdAt,
      updatedAt: updatedCart.updatedAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:sessionId/items/:itemId
// @access  Public
router.delete('/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    
    const cart = await ShoppingCart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    console.log('Removing item from cart:', { itemId });
    
    // Log all items in the cart before removal
    console.log('Cart items before removal:', cart.items.map(item => ({
      _id: item._id.toString(),
      productAttributePriceId: item.productAttributePriceId.toString(),
      quantity: item.quantity
    })));
    
    // Remove the item from the cart
    const itemToRemove = cart.items.find(item => item._id.toString() === itemId);
    if (itemToRemove) {
      console.log('Found item to remove:', {
        _id: itemToRemove._id.toString(),
        productAttributePriceId: itemToRemove.productAttributePriceId.toString(),
        quantity: itemToRemove.quantity
      });
    } else {
      console.log('Item not found in cart');
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.updatedAt = Date.now();
    
    // Log all items in the cart after removal
    console.log('Cart items after removal:', cart.items.length);
    
    const updatedCart = await cart.save();
    
    // Populate the cart items with product details before returning
    const populatedItems = await Promise.all(updatedCart.items.map(async (item) => {
      // Get the product attribute price details
      const attributePrice = await ProductAttributePrice.findById(item.productAttributePriceId)
        .populate('productId')
        .populate('attributeId');
      
      if (!attributePrice) {
        return {
          ...item.toObject(),
          product: null,
          attribute: null,
          price: 0
        };
      }
      
      return {
        ...item.toObject(),
        product: attributePrice.productId ? {
          _id: attributePrice.productId._id,
          name: attributePrice.productId.name,
          image: attributePrice.productId.image
        } : null,
        attribute: attributePrice.attributeId ? {
          attributeName: attributePrice.attributeId.attributeName,
          attributeValue: attributePrice.attributeId.attributeValue
        } : null,
        price: attributePrice.price
      };
    }));
    
    // Return the populated cart
    res.json({
      _id: updatedCart._id,
      sessionId: updatedCart.sessionId,
      items: populatedItems,
      createdAt: updatedCart.createdAt,
      updatedAt: updatedCart.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/:sessionId
// @access  Public
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await ShoppingCart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Clear all items
    cart.items = [];
    cart.updatedAt = Date.now();
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
