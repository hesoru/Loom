const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const CategoryProduct = require('../models/CategoryProduct');
const ProductAttribute = require('../models/ProductAttribute');
const ProductAttributePrice = require('../models/ProductAttributePrice');
const ShoppingCart = require('../models/ShoppingCart');
// Order model not needed for initial seeding

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/store');

// Source data from local seed data
const productsData = require('./seedData');

// Function to seed the database
const importData = async () => {
  try {
    // Clear all existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await CategoryProduct.deleteMany();
    await ProductAttribute.deleteMany();
    await ProductAttributePrice.deleteMany();
    await ShoppingCart.deleteMany();
    // Skip Order deletion since we won't be creating any orders

    console.log('Data cleared...');

    // Extract unique categories from products and add Best Sellers category
    const uniqueCategories = [...new Set(productsData.products.map(p => p.category)), 'Best Sellers'];
    
    const categoryDocs = uniqueCategories.map(name => ({
      name
    }));
    
    const createdCategories = await Category.insertMany(categoryDocs);
    
    // Create a map of category names to their MongoDB IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const productDocs = productsData.products.map(p => ({
      name: p.name,
      description: p.description,
      image: p.image,
      price: p.price
    }));
    
    const createdProducts = await Product.insertMany(productDocs);
    
    // Create category-product relationships
    const categoryProductDocs = [];
    productsData.products.forEach((p, index) => {
      categoryProductDocs.push({
        categoryId: categoryMap[p.category],
        productId: createdProducts[index]._id
      });
    });
    
    await CategoryProduct.insertMany(categoryProductDocs);
    
    // Add products to Best Sellers category (one from each existing category)
    const bestSellersCategory = createdCategories.find(cat => cat.name === 'Best Sellers');
    if (bestSellersCategory) {
      // Get one product from each existing category
      const existingCategories = [...new Set(productsData.products.map(p => p.category))];
      const bestSellerProducts = [];
      
      for (const category of existingCategories) {
        // Find first product of this category
        const productIndex = productsData.products.findIndex(p => p.category === category);
        if (productIndex !== -1) {
          bestSellerProducts.push({
            categoryId: bestSellersCategory._id,
            productId: createdProducts[productIndex]._id
          });
        }
      }
      
      // Insert best seller category-product relationships
      await CategoryProduct.insertMany(bestSellerProducts);
      console.log(`Added ${bestSellerProducts.length} products to Best Sellers category`);
    }
    
    // Create product attributes (sizes) and their prices
    const attributePriceMap = {}; // To store created attribute prices for sample cart
    for (let i = 0; i < productsData.products.length; i++) {
      const p = productsData.products[i];
      const productId = createdProducts[i]._id;
      
      if (p.availableSizes && p.availableSizes.length > 0) {
        for (const size of p.availableSizes) {
          // Create attribute
          const attribute = {
            productId: productId,
            attributeName: 'Size',
            attributeValue: size
          };
          
          const createdAttribute = await ProductAttribute.create(attribute);
          
          // Create attribute price (with small price variation based on size)
          let priceAdjustment = 0;
          const sizeIndex = p.availableSizes.indexOf(size);
          if (sizeIndex > 0) {
            priceAdjustment = sizeIndex * 5; // $5 increase per size up
          }
          
          const attributePrice = {
            productId: productId,
            attributeId: createdAttribute._id,
            price: p.price + priceAdjustment
          };
          
          const createdAttributePrice = await ProductAttributePrice.create(attributePrice);
          
          // Store the first attribute price for each product for sample cart
          if (sizeIndex === 0) {
            attributePriceMap[p.id] = createdAttributePrice._id;
          }
        }
      }
    }
        
    // Create a sample shopping cart
    const sampleCart = {
      sessionId: uuidv4(),
      items: [
        {
          productAttributePriceId: attributePriceMap[1], // First product, first size
          quantity: 2
        },
        {
          productAttributePriceId: attributePriceMap[3], // Another product, first size
          quantity: 1
        }
      ]
    };
    
    const createdCart = await ShoppingCart.create(sampleCart);
    
    // Skip creating sample orders for initial seeding
    
    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await CategoryProduct.deleteMany();
    await ProductAttribute.deleteMany();
    await ProductAttributePrice.deleteMany();
    await ShoppingCart.deleteMany();
    // Skip Order deletion since we removed the import

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
