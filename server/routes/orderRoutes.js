const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Order = require('../models/Order');
const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');

// Helper function to generate a unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}-${randomNum}`;
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get orders for a specific user
// @route   GET /api/orders/user/:userId
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      // Populate product details for each item in the order
      const populatedItems = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        return {
          ...item.toObject(),
          product: product ? {
            name: product.name,
            image: product.image
          } : { name: 'Product no longer available' }
        };
      }));
      
      res.json({
        ...order.toObject(),
        items: populatedItems
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('Order creation request body:', req.body);
    
    const { customerName, customerEmail, sessionId, userId } = req.body;
    
    // Validate required fields
    if (!customerName || !customerEmail || !sessionId) {
      console.log('Missing required fields:', { customerName, customerEmail, sessionId });
      return res.status(400).json({ message: 'Please provide customer name, email, and session ID' });
    }
    
    // Get the cart by sessionId (string)
    console.log('Looking for cart with sessionId:', sessionId);
    const cart = await ShoppingCart.findOne({ sessionId: sessionId });
    console.log('Cart found:', cart ? 'Yes' : 'No');
    
    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }
    
    console.log('Cart items count:', cart.items ? cart.items.length : 0);
    console.log('Cart items:', JSON.stringify(cart.items));
    
    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Get the populated cart items with product details
    const populatedCart = await ShoppingCart.findOne({ sessionId: sessionId })
      .populate({
        path: 'items.productAttributePriceId',
        populate: [
          { path: 'productId', model: 'Product' },
          { path: 'attributeId', model: 'ProductAttribute' }
        ]
      });
    
    if (!populatedCart) {
      return res.status(400).json({ message: 'Error retrieving cart details' });
    }
    
    console.log('Populated cart items:', populatedCart.items.length);
    
    // Prepare order items with necessary details
    const orderItems = populatedCart.items.map(item => {
      const attributePrice = item.productAttributePriceId;
      const product = attributePrice.productId;
      const attribute = attributePrice.attributeId;
      
      return {
        productAttributePriceId: item.productAttributePriceId._id,
        quantity: item.quantity,
        price: attributePrice.price,
        productId: product._id,
        productName: product.name,
        productImage: product.image,
        attributeValue: attribute ? attribute.attributeValue : 'Standard'
      };
    });
    
    console.log('Order items prepared:', orderItems.length);
    
    // Calculate total amount
    const totalAmount = orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Create the order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      customerName,
      customerEmail,
      sessionId,
      items: orderItems,
      totalAmount,
      // Add userId if it's provided (for logged-in users)
      ...(userId && { userId })
    });
    
    console.log('Creating order with:', {
      orderNumber: order.orderNumber,
      customerName,
      customerEmail,
      sessionId,
      userId: userId || 'guest checkout',
      itemsCount: orderItems.length,
      totalAmount
    });
    
    const createdOrder = await order.save();
    
    // Clear the cart after successful order creation
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status || order.status;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
