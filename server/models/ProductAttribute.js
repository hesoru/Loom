const mongoose = require('mongoose');

const ProductAttributeSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  attributeName: {
    type: String,
    required: true,
    trim: true
  },
  attributeValue: {
    type: String,
    required: true,
    trim: true
  }
});

// Compound index to ensure unique attribute combinations per product
ProductAttributeSchema.index(
  { productId: 1, attributeName: 1, attributeValue: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('ProductAttribute', ProductAttributeSchema);
