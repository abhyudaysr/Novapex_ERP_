import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // 1. Try to connect to the database
    await connectDB();

    // 2. Try to create a dummy user
    const testUser = await User.create({
      name: "Test Connection",
      email: `test-${Math.random()}@novapex.com`,
      role: "employee",
      dept: "Testing"
    });

    return NextResponse.json({ 
      message: "Database Connected Successfully!", 
      userCreated: testUser 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "Connection Failed", 
      error: error.message 
    }, { status: 500 });
  }
}