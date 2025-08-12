const mongoose = require('mongoose');

const CategoryProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

// Compound index to ensure a product can only be in a category once
CategoryProductSchema.index({ categoryId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('CategoryProduct', CategoryProductSchema);
