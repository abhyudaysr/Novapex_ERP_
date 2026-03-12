import type { ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { MOCK_COMPANIES, type CompanyRecord } from "./mock-companies"
import {
  MOCK_LEAVE_BALANCES,
  MOCK_LEAVE_REQUESTS,
  getLeaveBalanceKey,
  type LeaveBalance,
  type LeaveRequestRecord,
  type LeaveStatus,
  type LeaveType,
} from "./mock-leave-requests"
import { MOCK_USERS, type UserRecord, type UserRole } from "./mock-users"
import { getMySqlPool, isMySqlConfigured, pingMySql } from "@/lib/mysql/client"

export interface RepositoryHealth {
  ok: boolean
  message: string
}

export interface CreateLeaveRequestInput {
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
}

export type LeaveAction = "approve" | "reject" | "cancel"

export class RepositoryError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = "RepositoryError"
    this.status = status
  }
}

export interface UserRepository {
  provider: "memory" | "mysql"
  findByEmail(email: string): Promise<UserRecord | null>
  findByEmailAndCompany(email: string, companyName: string): Promise<UserRecord | null>
  listLeaveRequestsForActor(actor: UserRecord): Promise<LeaveRequestRecord[]>
  createLeaveRequest(actor: UserRecord, input: CreateLeaveRequestInput): Promise<LeaveRequestRecord>
  changeLeaveRequestStatus(
    actor: UserRecord,
    requestId: string,
    action: LeaveAction,
  ): Promise<LeaveRequestRecord>
  getLeaveBalance(companyId: string, email: string): Promise<LeaveBalance | null>
  health(): Promise<RepositoryHealth>
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function parseIsoDate(dateText: string): Date {
  const parts = dateText.split("-").map(Number)
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new RepositoryError("Date must be in YYYY-MM-DD format.", 400)
  }

  const [year, month, day] = parts
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new RepositoryError("Date value is invalid.", 400)
  }
  return parsed
}

function computeInclusiveDays(startDate: string, endDate: string): number {
  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)
  const diff = end.getTime() - start.getTime()
  if (diff < 0) {
    throw new RepositoryError("End date cannot be before start date.", 400)
  }
  return Math.floor(diff / 86400000) + 1
}

function mapLeaveTypeToBalanceKey(leaveType: LeaveType): keyof LeaveBalance {
  const value = leaveType.toLowerCase()
  if (value.includes("sick")) return "sick"
  if (value.includes("personal")) return "personal"
  return "annual"
}

function asLeaveType(value: string): LeaveType {
  if (value === "Sick Leave") return "Sick Leave"
  if (value === "Personal Leave") return "Personal Leave"
  return "Annual Leave"
}

function asLeaveStatus(value: string): LeaveStatus {
  if (value === "Approved") return "Approved"
  if (value === "Rejected") return "Rejected"
  if (value === "Cancelled") return "Cancelled"
  return "Pending"
}

function asUserRole(value: string): UserRole {
  if (value === "hr") return "hr"
  if (value === "manager") return "manager"
  return "employee"
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function generateRequestCode(): string {
  return `LR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

interface MySqlUserRow extends RowDataPacket {
  email: string
  name: string
  role: string
  dept: string
  companyId: string
  companyName: string
  companyLogo: string | null
  managerEmail: string | null
}

interface MySqlLeaveRow extends RowDataPacket {
  id: string
  companyId: string
  employeeEmail: string
  employeeName: string
  employeeDepartment: string
  employeeAvatar: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: string
  appliedDate: string
  approverEmail: string
  approverName: string
  decidedByEmail: string | null
  decidedAt: string | null
}

interface MySqlBalanceRow extends RowDataPacket {
  annualUsed: number
  annualTotal: number
  sickUsed: number
  sickTotal: number
  personalUsed: number
  personalTotal: number
}

class InMemoryUserRepository implements UserRepository {
  provider: "memory" = "memory"
  private readonly users: UserRecord[]
  private readonly companies: CompanyRecord[]
  private leaveRequests: LeaveRequestRecord[]
  private leaveBalances: Record<string, LeaveBalance>
  private sequence: number

  constructor() {
    this.users = MOCK_USERS.map((user) => ({
      ...user,
      email: normalizeEmail(user.email),
      managerEmail: user.managerEmail ? normalizeEmail(user.managerEmail) : undefined,
    }))
    this.companies = MOCK_COMPANIES.map((company) => ({ ...company }))
    this.leaveRequests = MOCK_LEAVE_REQUESTS.map((request) => ({ ...request }))
    this.leaveBalances = JSON.parse(JSON.stringify(MOCK_LEAVE_BALANCES))
    this.sequence = this.leaveRequests.reduce((max, request) => {
      const numericPart = Number(request.id.replace(/[^\d]/g, ""))
      return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max
    }, 0)
  }

  private cloneRequest(record: LeaveRequestRecord): LeaveRequestRecord {
    return { ...record }
  }

  private cloneBalance(balance: LeaveBalance): LeaveBalance {
    return JSON.parse(JSON.stringify(balance))
  }

  private findCompany(companyName: string): CompanyRecord | null {
    const normalized = normalizeText(companyName)
    if (!normalized) return null

    return (
      this.companies.find((company) => {
        if (normalizeText(company.id) === normalized) return true
        if (normalizeText(company.name) === normalized) return true
        return company.aliases.some((alias) => normalizeText(alias) === normalized)
      }) ?? null
    )
  }

  private findUserInCompany(email: string, companyId: string): UserRecord | null {
    const normalizedEmail = normalizeEmail(email)
    return (
      this.users.find(
        (user) => user.companyId === companyId && normalizeEmail(user.email) === normalizedEmail,
      ) ?? null
    )
  }

  private resolveApprover(actor: UserRecord): UserRecord {
    if (actor.role === "employee") {
      const managerEmail = actor.managerEmail
      if (!managerEmail) {
        throw new RepositoryError(
          "No manager is mapped for this employee in the current company.",
          400,
        )
      }
      const manager = this.findUserInCompany(managerEmail, actor.companyId)
      if (!manager || manager.role !== "manager") {
        throw new RepositoryError(
          "Mapped manager could not be found in this company context.",
          400,
        )
      }
      return manager
    }

    if (actor.role === "manager") {
      const hr = this.users.find(
        (user) => user.companyId === actor.companyId && user.role === "hr",
      )
      return hr ?? actor
    }

    return actor
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalized = normalizeEmail(email)
    return this.users.find((user) => normalizeEmail(user.email) === normalized) ?? null
  }

  async findByEmailAndCompany(email: string, companyName: string): Promise<UserRecord | null> {
    const company = this.findCompany(companyName)
    if (!company) return null
    const user = this.findUserInCompany(email, company.id)
    if (!user) return null
    return {
      ...user,
      companyName: company.name,
      companyLogo: company.logoUrl || user.companyLogo,
    }
  }

  async listLeaveRequestsForActor(actor: UserRecord): Promise<LeaveRequestRecord[]> {
    const email = normalizeEmail(actor.email)
    const companyScoped = this.leaveRequests.filter(
      (request) => request.companyId === actor.companyId,
    )

    let filtered = companyScoped
    if (actor.role === "manager") {
      filtered = companyScoped.filter(
        (request) =>
          normalizeEmail(request.approverEmail) === email ||
          normalizeEmail(request.employeeEmail) === email,
      )
    } else if (actor.role === "employee") {
      filtered = companyScoped.filter(
        (request) => normalizeEmail(request.employeeEmail) === email,
      )
    }

    return filtered
      .slice()
      .sort((a, b) => {
        const aDate = new Date(a.appliedDate).getTime()
        const bDate = new Date(b.appliedDate).getTime()
        return bDate - aDate
      })
      .map((record) => this.cloneRequest(record))
  }

  async createLeaveRequest(
    actor: UserRecord,
    input: CreateLeaveRequestInput,
  ): Promise<LeaveRequestRecord> {
    const reason = (input.reason || "").trim()
    if (!reason) {
      throw new RepositoryError("Reason is required.", 400)
    }
    if (reason.length < 8) {
      throw new RepositoryError("Reason should be at least 8 characters.", 400)
    }

    const leaveType = input.leaveType
    if (!leaveType || !["Annual Leave", "Sick Leave", "Personal Leave"].includes(leaveType)) {
      throw new RepositoryError("Invalid leave type.", 400)
    }

    const days = computeInclusiveDays(input.startDate, input.endDate)
    if (days > 30) {
      throw new RepositoryError("A single request cannot exceed 30 days.", 400)
    }

    const balance = await this.getLeaveBalance(actor.companyId, actor.email)
    if (balance) {
      const bucket = mapLeaveTypeToBalanceKey(leaveType)
      if (balance[bucket].used + days > balance[bucket].total) {
        throw new RepositoryError("Insufficient leave balance for this request.", 400)
      }
    }

    const approver = this.resolveApprover(actor)
    this.sequence += 1

    const newRequest: LeaveRequestRecord = {
      id: `LR-${this.sequence}`,
      companyId: actor.companyId,
      employeeEmail: normalizeEmail(actor.email),
      employeeName: actor.name,
      employeeDepartment: actor.dept,
      employeeAvatar: actor.avatar || "",
      leaveType,
      startDate: input.startDate,
      endDate: input.endDate,
      days,
      reason,
      status: "Pending",
      appliedDate: todayIsoDate(),
      approverEmail: normalizeEmail(approver.email),
      approverName: approver.name,
    }

    this.leaveRequests.unshift(newRequest)
    return this.cloneRequest(newRequest)
  }

  async changeLeaveRequestStatus(
    actor: UserRecord,
    requestId: string,
    action: LeaveAction,
  ): Promise<LeaveRequestRecord> {
    const normalizedAction = action.toLowerCase() as LeaveAction
    if (!["approve", "reject", "cancel"].includes(normalizedAction)) {
      throw new RepositoryError("Invalid leave action.", 400)
    }

    const normalizedActorEmail = normalizeEmail(actor.email)
    const index = this.leaveRequests.findIndex(
      (request) => request.id === requestId && request.companyId === actor.companyId,
    )
    if (index < 0) {
      throw new RepositoryError("Leave request not found in this company.", 404)
    }

    const existing = this.leaveRequests[index]
    if (existing.status !== "Pending") {
      throw new RepositoryError("Only pending leave requests can be updated.", 400)
    }

    let nextStatus: LeaveStatus
    if (normalizedAction === "cancel") {
      if (normalizeEmail(existing.employeeEmail) !== normalizedActorEmail) {
        throw new RepositoryError("Only the request owner can cancel this request.", 403)
      }
      nextStatus = "Cancelled"
    } else {
      const canDecide =
        actor.role === "hr" ||
        (actor.role === "manager" &&
          normalizeEmail(existing.approverEmail) === normalizedActorEmail)

      if (!canDecide) {
        throw new RepositoryError(
          "Only HR or the assigned manager can approve or reject this request.",
          403,
        )
      }
      nextStatus = normalizedAction === "approve" ? "Approved" : "Rejected"
    }

    const updated: LeaveRequestRecord = {
      ...existing,
      status: nextStatus,
      decidedByEmail: normalizedActorEmail,
      decidedAt: todayIsoDate(),
    }
    this.leaveRequests[index] = updated

    if (nextStatus === "Approved") {
      const balanceKey = getLeaveBalanceKey(updated.companyId, updated.employeeEmail)
      const balance = this.leaveBalances[balanceKey]
      if (balance) {
        const bucket = mapLeaveTypeToBalanceKey(updated.leaveType)
        balance[bucket].used = Math.min(balance[bucket].total, balance[bucket].used + updated.days)
      }
    }

    return this.cloneRequest(updated)
  }

  async getLeaveBalance(companyId: string, email: string): Promise<LeaveBalance | null> {
    const key = getLeaveBalanceKey(companyId, email)
    const balance = this.leaveBalances[key]
    return balance ? this.cloneBalance(balance) : null
  }

  async health(): Promise<RepositoryHealth> {
    return {
      ok: true,
      message: "In-memory repository active (multi-tenant + leave workflow).",
    }
  }
}

class MySqlRepository implements UserRepository {
  provider: "mysql" = "mysql"

  private ensureConfigured(): void {
    if (!isMySqlConfigured()) {
      throw new RepositoryError(
        "MySQL is selected but not configured. Set MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.",
        500,
      )
    }
  }

  private mapUserRow(row: MySqlUserRow): UserRecord {
    return {
      email: normalizeEmail(row.email),
      name: row.name,
      role: asUserRole((row.role || "").toLowerCase()),
      dept: row.dept || "General",
      companyId: row.companyId,
      companyName: row.companyName,
      companyLogo: row.companyLogo || "",
      managerEmail: row.managerEmail ? normalizeEmail(row.managerEmail) : undefined,
      avatar: "",
    }
  }

  private mapLeaveRow(row: MySqlLeaveRow): LeaveRequestRecord {
    return {
      id: row.id,
      companyId: row.companyId,
      employeeEmail: normalizeEmail(row.employeeEmail),
      employeeName: row.employeeName || row.employeeEmail,
      employeeDepartment: row.employeeDepartment || "General",
      employeeAvatar: row.employeeAvatar || "",
      leaveType: asLeaveType(row.leaveType),
      startDate: row.startDate,
      endDate: row.endDate,
      days: Number(row.days || 0),
      reason: row.reason || "",
      status: asLeaveStatus(row.status),
      appliedDate: row.appliedDate,
      approverEmail: normalizeEmail(row.approverEmail),
      approverName: row.approverName || row.approverEmail,
      decidedByEmail: row.decidedByEmail ? normalizeEmail(row.decidedByEmail) : undefined,
      decidedAt: row.decidedAt || undefined,
    }
  }

  private async findFirstByRole(companyId: string, role: UserRole): Promise<UserRecord | null> {
    const pool = getMySqlPool()
    const [rows] = await pool.query<MySqlUserRow[]>(
      `
        SELECT
          u.email AS email,
          u.full_name AS name,
          u.role AS role,
          u.dept AS dept,
          u.company_id AS companyId,
          c.name AS companyName,
          c.logo_url AS companyLogo,
          u.manager_email AS managerEmail
        FROM users u
        JOIN companies c ON c.id = u.company_id
        WHERE u.company_id = ? AND LOWER(u.role) = LOWER(?) AND u.is_active = 1
        ORDER BY u.id ASC
        LIMIT 1
      `,
      [companyId, role],
    )

    if (!rows.length) return null
    return this.mapUserRow(rows[0])
  }

  private async findByEmailWithinCompany(
    companyId: string,
    email: string,
  ): Promise<UserRecord | null> {
    const pool = getMySqlPool()
    const [rows] = await pool.query<MySqlUserRow[]>(
      `
        SELECT
          u.email AS email,
          u.full_name AS name,
          u.role AS role,
          u.dept AS dept,
          u.company_id AS companyId,
          c.name AS companyName,
          c.logo_url AS companyLogo,
          u.manager_email AS managerEmail
        FROM users u
        JOIN companies c ON c.id = u.company_id
        WHERE u.company_id = ? AND LOWER(u.email) = LOWER(?) AND u.is_active = 1
        LIMIT 1
      `,
      [companyId, email],
    )

    if (!rows.length) return null
    return this.mapUserRow(rows[0])
  }

  private async getLeaveRequestByCode(
    companyId: string,
    requestCode: string,
  ): Promise<LeaveRequestRecord | null> {
    const pool = getMySqlPool()
    const [rows] = await pool.query<MySqlLeaveRow[]>(
      `
        SELECT
          lr.request_code AS id,
          lr.company_id AS companyId,
          lr.employee_email AS employeeEmail,
          COALESCE(emp.full_name, lr.employee_email) AS employeeName,
          COALESCE(emp.dept, 'General') AS employeeDepartment,
          '' AS employeeAvatar,
          lr.leave_type AS leaveType,
          DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS startDate,
          DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS endDate,
          lr.days AS days,
          lr.reason AS reason,
          lr.status AS status,
          DATE_FORMAT(lr.applied_at, '%Y-%m-%d') AS appliedDate,
          lr.approver_email AS approverEmail,
          COALESCE(app.full_name, lr.approver_email) AS approverName,
          lr.decided_by_email AS decidedByEmail,
          CASE WHEN lr.decided_at IS NULL THEN NULL ELSE DATE_FORMAT(lr.decided_at, '%Y-%m-%d') END AS decidedAt
        FROM leave_requests lr
        LEFT JOIN users emp ON emp.company_id = lr.company_id AND LOWER(emp.email) = LOWER(lr.employee_email)
        LEFT JOIN users app ON app.company_id = lr.company_id AND LOWER(app.email) = LOWER(lr.approver_email)
        WHERE lr.company_id = ? AND lr.request_code = ?
        LIMIT 1
      `,
      [companyId, requestCode],
    )

    if (!rows.length) return null
    return this.mapLeaveRow(rows[0])
  }

  private async resolveApprover(actor: UserRecord): Promise<UserRecord> {
    if (actor.role === "employee") {
      const managerEmail = actor.managerEmail ? normalizeEmail(actor.managerEmail) : ""

      if (managerEmail) {
        const directManager = await this.findByEmailWithinCompany(actor.companyId, managerEmail)
        if (directManager && directManager.role === "manager") return directManager
      }

      const fallbackManager = await this.findFirstByRole(actor.companyId, "manager")
      if (!fallbackManager) {
        throw new RepositoryError(
          "No manager is configured for this company. Cannot route leave request.",
          400,
        )
      }
      return fallbackManager
    }

    if (actor.role === "manager") {
      const hr = await this.findFirstByRole(actor.companyId, "hr")
      return hr ?? actor
    }

    return actor
  }

  private async ensureBalanceRow(companyId: string, employeeEmail: string): Promise<void> {
    const pool = getMySqlPool()
    await pool.execute<ResultSetHeader>(
      `
        INSERT INTO leave_balances (
          company_id,
          employee_email,
          annual_used,
          annual_total,
          sick_used,
          sick_total,
          personal_used,
          personal_total
        ) VALUES (?, ?, 0, 20, 0, 10, 0, 5)
        ON DUPLICATE KEY UPDATE employee_email = VALUES(employee_email)
      `,
      [companyId, normalizeEmail(employeeEmail)],
    )
  }

  private async applyApprovedLeaveToBalance(
    companyId: string,
    employeeEmail: string,
    leaveType: LeaveType,
    days: number,
  ): Promise<void> {
    const pool = getMySqlPool()
    const bucket = mapLeaveTypeToBalanceKey(leaveType)

    if (bucket === "annual") {
      await pool.execute<ResultSetHeader>(
        `
          UPDATE leave_balances
          SET annual_used = LEAST(annual_total, annual_used + ?)
          WHERE company_id = ? AND LOWER(employee_email) = LOWER(?)
        `,
        [days, companyId, employeeEmail],
      )
      return
    }

    if (bucket === "sick") {
      await pool.execute<ResultSetHeader>(
        `
          UPDATE leave_balances
          SET sick_used = LEAST(sick_total, sick_used + ?)
          WHERE company_id = ? AND LOWER(employee_email) = LOWER(?)
        `,
        [days, companyId, employeeEmail],
      )
      return
    }

    await pool.execute<ResultSetHeader>(
      `
        UPDATE leave_balances
        SET personal_used = LEAST(personal_total, personal_used + ?)
        WHERE company_id = ? AND LOWER(employee_email) = LOWER(?)
      `,
      [days, companyId, employeeEmail],
    )
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    this.ensureConfigured()
    const pool = getMySqlPool()

    const [rows] = await pool.query<MySqlUserRow[]>(
      `
        SELECT
          u.email AS email,
          u.full_name AS name,
          u.role AS role,
          u.dept AS dept,
          u.company_id AS companyId,
          c.name AS companyName,
          c.logo_url AS companyLogo,
          u.manager_email AS managerEmail
        FROM users u
        JOIN companies c ON c.id = u.company_id
        WHERE LOWER(u.email) = LOWER(?) AND u.is_active = 1
        LIMIT 1
      `,
      [email],
    )

    if (!rows.length) return null
    return this.mapUserRow(rows[0])
  }

  async findByEmailAndCompany(email: string, companyName: string): Promise<UserRecord | null> {
    this.ensureConfigured()
    const pool = getMySqlPool()
    const normalizedCompany = companyName.trim()

    const [rows] = await pool.query<MySqlUserRow[]>(
      `
        SELECT
          u.email AS email,
          u.full_name AS name,
          u.role AS role,
          u.dept AS dept,
          u.company_id AS companyId,
          c.name AS companyName,
          c.logo_url AS companyLogo,
          u.manager_email AS managerEmail
        FROM users u
        JOIN companies c ON c.id = u.company_id
        WHERE (LOWER(c.name) = LOWER(?) OR LOWER(c.id) = LOWER(?))
          AND LOWER(u.email) = LOWER(?)
          AND u.is_active = 1
        LIMIT 1
      `,
      [normalizedCompany, normalizedCompany, email],
    )

    if (!rows.length) return null
    return this.mapUserRow(rows[0])
  }

  async listLeaveRequestsForActor(actor: UserRecord): Promise<LeaveRequestRecord[]> {
    this.ensureConfigured()
    const pool = getMySqlPool()
    const params: string[] = [actor.companyId]
    let scopeSql = ""

    if (actor.role === "manager") {
      scopeSql = " AND (LOWER(lr.approver_email) = LOWER(?) OR LOWER(lr.employee_email) = LOWER(?))"
      params.push(actor.email, actor.email)
    } else if (actor.role === "employee") {
      scopeSql = " AND LOWER(lr.employee_email) = LOWER(?)"
      params.push(actor.email)
    }

    const [rows] = await pool.query<MySqlLeaveRow[]>(
      `
        SELECT
          lr.request_code AS id,
          lr.company_id AS companyId,
          lr.employee_email AS employeeEmail,
          COALESCE(emp.full_name, lr.employee_email) AS employeeName,
          COALESCE(emp.dept, 'General') AS employeeDepartment,
          '' AS employeeAvatar,
          lr.leave_type AS leaveType,
          DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS startDate,
          DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS endDate,
          lr.days AS days,
          lr.reason AS reason,
          lr.status AS status,
          DATE_FORMAT(lr.applied_at, '%Y-%m-%d') AS appliedDate,
          lr.approver_email AS approverEmail,
          COALESCE(app.full_name, lr.approver_email) AS approverName,
          lr.decided_by_email AS decidedByEmail,
          CASE WHEN lr.decided_at IS NULL THEN NULL ELSE DATE_FORMAT(lr.decided_at, '%Y-%m-%d') END AS decidedAt
        FROM leave_requests lr
        LEFT JOIN users emp ON emp.company_id = lr.company_id AND LOWER(emp.email) = LOWER(lr.employee_email)
        LEFT JOIN users app ON app.company_id = lr.company_id AND LOWER(app.email) = LOWER(lr.approver_email)
        WHERE lr.company_id = ? ${scopeSql}
        ORDER BY lr.applied_at DESC, lr.id DESC
      `,
      params,
    )

    return rows.map((row) => this.mapLeaveRow(row))
  }

  async createLeaveRequest(
    actor: UserRecord,
    input: CreateLeaveRequestInput,
  ): Promise<LeaveRequestRecord> {
    this.ensureConfigured()
    const pool = getMySqlPool()

    const reason = (input.reason || "").trim()
    if (!reason) {
      throw new RepositoryError("Reason is required.", 400)
    }
    if (reason.length < 8) {
      throw new RepositoryError("Reason should be at least 8 characters.", 400)
    }

    const leaveType = input.leaveType
    if (!leaveType || !["Annual Leave", "Sick Leave", "Personal Leave"].includes(leaveType)) {
      throw new RepositoryError("Invalid leave type.", 400)
    }

    const days = computeInclusiveDays(input.startDate, input.endDate)
    if (days > 30) {
      throw new RepositoryError("A single request cannot exceed 30 days.", 400)
    }

    const balance = await this.getLeaveBalance(actor.companyId, actor.email)
    if (balance) {
      const bucket = mapLeaveTypeToBalanceKey(leaveType)
      if (balance[bucket].used + days > balance[bucket].total) {
        throw new RepositoryError("Insufficient leave balance for this request.", 400)
      }
    }

    const approver = await this.resolveApprover(actor)
    const requestCode = generateRequestCode()

    await pool.execute<ResultSetHeader>(
      `
        INSERT INTO leave_requests (
          request_code,
          company_id,
          employee_email,
          approver_email,
          leave_type,
          start_date,
          end_date,
          days,
          reason,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `,
      [
        requestCode,
        actor.companyId,
        normalizeEmail(actor.email),
        normalizeEmail(approver.email),
        leaveType,
        input.startDate,
        input.endDate,
        days,
        reason,
      ],
    )

    const created = await this.getLeaveRequestByCode(actor.companyId, requestCode)
    if (!created) {
      throw new RepositoryError("Leave request was created but could not be reloaded.", 500)
    }
    return created
  }

  async changeLeaveRequestStatus(
    actor: UserRecord,
    requestId: string,
    action: LeaveAction,
  ): Promise<LeaveRequestRecord> {
    this.ensureConfigured()
    const pool = getMySqlPool()

    const normalizedAction = action.toLowerCase() as LeaveAction
    if (!["approve", "reject", "cancel"].includes(normalizedAction)) {
      throw new RepositoryError("Invalid leave action.", 400)
    }

    const existing = await this.getLeaveRequestByCode(actor.companyId, requestId)
    if (!existing) {
      throw new RepositoryError("Leave request not found in this company.", 404)
    }
    if (existing.status !== "Pending") {
      throw new RepositoryError("Only pending leave requests can be updated.", 400)
    }

    const actorEmail = normalizeEmail(actor.email)
    let nextStatus: LeaveStatus

    if (normalizedAction === "cancel") {
      if (normalizeEmail(existing.employeeEmail) !== actorEmail) {
        throw new RepositoryError("Only the request owner can cancel this request.", 403)
      }
      nextStatus = "Cancelled"
    } else {
      const canDecide =
        actor.role === "hr" ||
        (actor.role === "manager" &&
          normalizeEmail(existing.approverEmail) === actorEmail)
      if (!canDecide) {
        throw new RepositoryError(
          "Only HR or the assigned manager can approve or reject this request.",
          403,
        )
      }
      nextStatus = normalizedAction === "approve" ? "Approved" : "Rejected"
    }

    await pool.execute<ResultSetHeader>(
      `
        UPDATE leave_requests
        SET status = ?, decided_at = NOW(), decided_by_email = ?
        WHERE company_id = ? AND request_code = ?
      `,
      [nextStatus, actorEmail, actor.companyId, requestId],
    )

    if (nextStatus === "Approved") {
      await this.ensureBalanceRow(existing.companyId, existing.employeeEmail)
      await this.applyApprovedLeaveToBalance(
        existing.companyId,
        existing.employeeEmail,
        existing.leaveType,
        existing.days,
      )
    }

    const updated = await this.getLeaveRequestByCode(actor.companyId, requestId)
    if (!updated) {
      throw new RepositoryError("Leave request updated but could not be reloaded.", 500)
    }
    return updated
  }

  async getLeaveBalance(companyId: string, email: string): Promise<LeaveBalance | null> {
    this.ensureConfigured()
    const pool = getMySqlPool()

    const [rows] = await pool.query<MySqlBalanceRow[]>(
      `
        SELECT
          annual_used AS annualUsed,
          annual_total AS annualTotal,
          sick_used AS sickUsed,
          sick_total AS sickTotal,
          personal_used AS personalUsed,
          personal_total AS personalTotal
        FROM leave_balances
        WHERE company_id = ? AND LOWER(employee_email) = LOWER(?)
        LIMIT 1
      `,
      [companyId, email],
    )

    if (!rows.length) return null
    const row = rows[0]
    return {
      annual: { used: Number(row.annualUsed), total: Number(row.annualTotal) },
      sick: { used: Number(row.sickUsed), total: Number(row.sickTotal) },
      personal: { used: Number(row.personalUsed), total: Number(row.personalTotal) },
    }
  }

  async health(): Promise<RepositoryHealth> {
    if (!isMySqlConfigured()) {
      return {
        ok: false,
        message:
          "MySQL selected but env vars are incomplete. Set MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.",
      }
    }

    try {
      await pingMySql()
      return {
        ok: true,
        message: "MySQL repository active and reachable.",
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown MySQL error."
      return {
        ok: false,
        message: `MySQL connection failed: ${message}`,
      }
    }
  }
}

const memoryRepo = new InMemoryUserRepository()
const mysqlRepo = new MySqlRepository()

export function getUserRepository(): UserRepository {
  const provider = (process.env.DB_PROVIDER || "memory").toLowerCase()
  return provider === "mysql" ? mysqlRepo : memoryRepo
}
