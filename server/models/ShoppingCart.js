const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productAttributePriceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductAttributePrice',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const ShoppingCartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [CartItemSchema]
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
module.exports.CartItemSchema = CartItemSchema;