const mongoose = require('mongoose');

const ProductAttributePriceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  attributeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductAttribute',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

// Ensure unique pricing per attribute
ProductAttributePriceSchema.index(
  { productId: 1, attributeId: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('ProductAttributePrice', ProductAttributePriceSchema);
