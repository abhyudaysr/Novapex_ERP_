import mongoose, { Schema, model, models } from "mongoose";

// This is the "Blueprint" for our User
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // No two users can have the same email
  },
  role: {
    type: String,
    enum: ["hr", "manager", "employee"], // Only these 3 roles are allowed
    default: "employee",
  },
  dept: {
    type: String,
    required: [true, "Please provide a department"],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  }
});

// If the model already exists, use it; otherwise, create it.
// This is important for Next.js hot-reloading.
const User = models.User || model("User", UserSchema);

export default User;