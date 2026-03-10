import { NextRequest, NextResponse } from "next/server"
import {
  RepositoryError,
  getUserRepository,
  type LeaveAction,
  type UserRepository,
} from "@/lib/data/user-repository"
import type { LeaveBalance, LeaveRequestRecord } from "@/lib/data/mock-leave-requests"

interface LeaveScopedPayload {
  email?: unknown
  company?: unknown
}

interface LeaveCreatePayload extends LeaveScopedPayload {
  leaveType?: unknown
  startDate?: unknown
  endDate?: unknown
  reason?: unknown
}

interface LeaveActionPayload extends LeaveScopedPayload {
  requestId?: unknown
  action?: unknown
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function mapRequestToClient(
  request: LeaveRequestRecord,
  balance: LeaveBalance | null,
) {
  return {
    id: request.id,
    employee: request.employeeName,
    employeeEmail: request.employeeEmail,
    department: request.employeeDepartment,
    avatar: request.employeeAvatar,
    leaveType: request.leaveType,
    startDate: request.startDate,
    endDate: request.endDate,
    days: request.days,
    reason: request.reason,
    status: request.status,
    appliedDate: request.appliedDate,
    approver: request.approverName,
    approverEmail: request.approverEmail,
    decidedAt: request.decidedAt || null,
    balance,
  }
}

function approvedInCurrentMonth(request: LeaveRequestRecord): boolean {
  if (request.status !== "Approved" || !request.decidedAt) return false
  const decidedAt = new Date(request.decidedAt)
  const now = new Date()
  return (
    decidedAt.getFullYear() === now.getFullYear() &&
    decidedAt.getMonth() === now.getMonth()
  )
}

async function buildScopedLeaveResponse(
  repository: UserRepository,
  email: string,
  company: string,
) {
  const actor = await repository.findByEmailAndCompany(email, company)
  if (!actor) {
    throw new RepositoryError("Invalid user or company context.", 401)
  }

  const requests = await repository.listLeaveRequestsForActor(actor)
  const mappedRequests = await Promise.all(
    requests.map(async (request) => {
      const balance = await repository.getLeaveBalance(
        request.companyId,
        request.employeeEmail,
      )
      return mapRequestToClient(request, balance)
    }),
  )

  const ownBalance = await repository.getLeaveBalance(actor.companyId, actor.email)
  const annualBalance = ownBalance
    ? `${Math.max(ownBalance.annual.total - ownBalance.annual.used, 0)}/${ownBalance.annual.total}`
    : "N/A"
  const sickLeaveLeft = ownBalance
    ? String(Math.max(ownBalance.sick.total - ownBalance.sick.used, 0))
    : "N/A"

  return {
    requests: mappedRequests,
    stats: {
      pendingRequests: mappedRequests.filter((request) => request.status === "Pending").length,
      approvedThisMonth: requests.filter((request) => approvedInCurrentMonth(request)).length,
      annualBalance,
      sickLeaveLeft,
      totalApprovedDays: requests
        .filter((request) => request.status === "Approved")
        .reduce((sum, request) => sum + request.days, 0),
    },
    actor: {
      email: actor.email,
      name: actor.name,
      role: actor.role,
      companyId: actor.companyId,
      companyName: actor.companyName,
    },
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof RepositoryError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  return NextResponse.json({ error: "Leave workflow failed." }, { status: 500 })
}

export async function GET(request: NextRequest) {
  const email = textValue(request.nextUrl.searchParams.get("email"))
  const company = textValue(request.nextUrl.searchParams.get("company"))

  if (!email || !company) {
    return NextResponse.json(
      { error: "Email and company are required for leave queries." },
      { status: 400 },
    )
  }

  const repository = getUserRepository()

  try {
    const scopedData = await buildScopedLeaveResponse(repository, email, company)
    return NextResponse.json(scopedData)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  let payload: LeaveCreatePayload
  try {
    payload = (await request.json()) as LeaveCreatePayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const email = textValue(payload.email)
  const company = textValue(payload.company)
  const leaveType = textValue(payload.leaveType)
  const startDate = textValue(payload.startDate)
  const endDate = textValue(payload.endDate)
  const reason = textValue(payload.reason)

  if (!email || !company || !leaveType || !startDate || !endDate || !reason) {
    return NextResponse.json(
      { error: "Email, company, leave type, dates, and reason are required." },
      { status: 400 },
    )
  }

  const repository = getUserRepository()

  try {
    const actor = await repository.findByEmailAndCompany(email, company)
    if (!actor) {
      return NextResponse.json({ error: "Invalid user or company context." }, { status: 401 })
    }

    const created = await repository.createLeaveRequest(actor, {
      leaveType: leaveType as "Annual Leave" | "Sick Leave" | "Personal Leave",
      startDate,
      endDate,
      reason,
    })

    const balance = await repository.getLeaveBalance(
      created.companyId,
      created.employeeEmail,
    )

    return NextResponse.json({
      message: "Leave request submitted.",
      request: mapRequestToClient(created, balance),
    })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest) {
  let payload: LeaveActionPayload
  try {
    payload = (await request.json()) as LeaveActionPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const email = textValue(payload.email)
  const company = textValue(payload.company)
  const requestId = textValue(payload.requestId)
  const action = textValue(payload.action).toLowerCase() as LeaveAction

  if (!email || !company || !requestId || !action) {
    return NextResponse.json(
      { error: "Email, company, request id, and action are required." },
      { status: 400 },
    )
  }

  const repository = getUserRepository()

  try {
    const actor = await repository.findByEmailAndCompany(email, company)
    if (!actor) {
      return NextResponse.json({ error: "Invalid user or company context." }, { status: 401 })
    }

    const updated = await repository.changeLeaveRequestStatus(actor, requestId, action)
    const balance = await repository.getLeaveBalance(
      updated.companyId,
      updated.employeeEmail,
    )

    const actionLabel =
      action === "approve" ? "approved" : action === "reject" ? "rejected" : "cancelled"
    return NextResponse.json({
      message: `Leave request ${actionLabel} successfully.`,
      request: mapRequestToClient(updated, balance),
    })
  } catch (error) {
    return toErrorResponse(error)
  }
}
