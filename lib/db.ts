import mongoose from "mongoose";

// We add .trim() here to automatically remove any hidden spaces or new lines
const MONGODB_URI = (process.env.MONGODB_URI || "").trim();

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // We add a shorter timeout so you don't have to wait 30 seconds to see if it failed
      serverSelectionTimeoutMS: 5000,
      // Prevent nameserver lookup issues
      retryWrites: true,
      w: 'majority',
    } as any;

    console.log("Attempting to connect to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Successfully connected to MongoDB!");
      return mongoose;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
};