const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Wait for MongoDB to be ready
const waitForMongo = async () => {
  console.log('Waiting for MongoDB to be ready...');
  
  return new Promise((resolve) => {
    const checkMongo = () => {
      const mongoose = require('mongoose');
      // In Docker environment, use mongodb service name, otherwise use localhost
      const mongoUri = process.env.NODE_ENV === 'production' 
        ? 'mongodb://mongodb:27017/store'
        : (process.env.MONGO_URI || 'mongodb://localhost:27017/store');
      
      console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
      
      mongoose.connect(mongoUri)
        .then(() => {
          console.log('MongoDB connected successfully');
          mongoose.disconnect();
          resolve();
        })
        .catch((err) => {
          console.log(`MongoDB connection error: ${err.message}`);
          console.log('Retrying in 2 seconds...');
          setTimeout(checkMongo, 2000);
        });
    };
    
    checkMongo();
  });
};

// Run the seeder script
const runSeeder = () => {
  return new Promise((resolve, reject) => {
    console.log('Running data seeder...');
    
    const seederPath = path.join(__dirname, 'data', 'seeder.js');
    
    // Check if seeder exists
    if (!fs.existsSync(seederPath)) {
      console.error('Seeder file not found!');
      return resolve();
    }
    
    // Run the seeder script
    exec(`node ${seederPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Seeder error: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.error(`Seeder stderr: ${stderr}`);
      }
      
      console.log(`Seeder output: ${stdout}`);
      resolve();
    });
  });
};

// Start the server
const startServer = () => {
  console.log('Starting server...');
  require('./server');
};

// Main function to orchestrate startup
const startup = async () => {
  try {
    await waitForMongo();
    await runSeeder();
    startServer();
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
};

// Run the startup process
startup();
