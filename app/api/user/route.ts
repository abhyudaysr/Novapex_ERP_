import { NextResponse } from "next/server";

// This is your simulated Database
const usersDatabase = [
  { email: "hr@novapex.com", name: "Sarah Johnson", role: "hr", dept: "Human Resources" },
  { email: "manager@novapex.com", name: "Alex Rivera", role: "manager", dept: "Engineering" },
  { email: "employee@novapex.com", name: "Jordan Smith", role: "employee", dept: "Operations" }
];

export async function POST(request: Request) {
  const { email } = await request.json();
  
  // Find user by email (Case-insensitive)
  const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ error: "Invalid corporate identity." }, { status: 401 });
  }
}