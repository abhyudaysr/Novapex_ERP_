import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    console.log("--- Attempting Cloud Connection ---",MONGODB_URI);
    await mongoose.connect(MONGODB_URI!);
    console.log("--- ✅ MongoDB Connected Successfully ---");
  } catch (error) {
    console.error("--- ❌ MongoDB Connection Error Details: ---");
    console.error(error);
    throw error;
  }
}