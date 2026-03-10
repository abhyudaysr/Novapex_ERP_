import { NextResponse } from "next/server"
import { getUserRepository, RepositoryError } from "@/lib/data/user-repository"

interface LoginRequestPayload {
  email?: unknown
  password?: unknown
  company?: unknown
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  let payload: LoginRequestPayload

  try {
    payload = (await request.json()) as LoginRequestPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const email = textValue(payload.email)
  const company = textValue(payload.company)

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }
  if (!company) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 })
  }

  const repository = getUserRepository()

  try {
    const user = await repository.findByEmailAndCompany(email, company)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid corporate identity. Check email and company name." },
        { status: 401 },
      )
    }

    return NextResponse.json({
      ...user,
      provider: repository.provider,
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: "Unable to authenticate user." }, { status: 500 })
  }
}
