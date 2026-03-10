import { NextResponse } from "next/server"
import { getUserRepository } from "@/lib/data/user-repository"
import { isMySqlConfigured } from "@/lib/mysql/client"

export async function GET() {
  const repository = getUserRepository()
  const health = await repository.health()

  return NextResponse.json({
    provider: repository.provider,
    ...health,
    mysqlConfigured: isMySqlConfigured(),
    migration: {
      mongoRemoved: true,
      mysqlImplemented: true,
      tenantScopedAuth: true,
      leaveWorkflowApi: true,
    },
  })
}
