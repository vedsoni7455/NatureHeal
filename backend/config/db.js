// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async (retryCount = 5) => {
  const options = {
    serverSelectionTimeoutMS: 10000, // Wait 10s for server selection
    family: 4, // Force IPv4 to avoid DNS/SRV resolution issues on some networks
  };

  while (retryCount > 0) {
    try {
      console.log(`📡 Connecting to MongoDB... (Attempts remaining: ${retryCount})`);
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return; // Success
    } catch (error) {
      retryCount--;
      console.error(`❌ Connection Error: ${error.message}`);

      if (retryCount === 0) {
        console.error('🛑 Critical: Max retries reached. Could not connect to MongoDB.');
        console.error('💡 TIP: Check if your IP address is whitelisted in MongoDB Atlas and that your internet connection is stable.');
        process.exit(1);
      }

      console.log('🔄 Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;
