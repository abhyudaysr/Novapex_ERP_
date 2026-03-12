export type LeaveType = "Annual Leave" | "Sick Leave" | "Personal Leave"
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled"

export interface LeaveBalanceBucket {
  used: number
  total: number
}

export interface LeaveBalance {
  annual: LeaveBalanceBucket
  sick: LeaveBalanceBucket
  personal: LeaveBalanceBucket
}

export interface LeaveRequestRecord {
  id: string
  companyId: string
  employeeEmail: string
  employeeName: string
  employeeDepartment: string
  employeeAvatar: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  appliedDate: string
  approverEmail: string
  approverName: string
  decidedByEmail?: string
  decidedAt?: string
}

export function getLeaveBalanceKey(companyId: string, email: string): string {
  return `${companyId}:${email.trim().toLowerCase()}`
}

export const MOCK_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  [getLeaveBalanceKey("novapex-hq", "employee@novapex.com")]: {
    annual: { used: 8, total: 20 },
    sick: { used: 3, total: 10 },
    personal: { used: 1, total: 5 },
  },
  [getLeaveBalanceKey("novapex-hq", "employee2@novapex.com")]: {
    annual: { used: 12, total: 20 },
    sick: { used: 2, total: 10 },
    personal: { used: 0, total: 5 },
  },
  [getLeaveBalanceKey("aster-dynamics", "employee@aster.com")]: {
    annual: { used: 5, total: 18 },
    sick: { used: 2, total: 8 },
    personal: { used: 1, total: 4 },
  },
}

export const MOCK_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  {
    id: "LR-1001",
    companyId: "novapex-hq",
    employeeEmail: "employee@novapex.com",
    employeeName: "Jordan Smith",
    employeeDepartment: "Engineering",
    employeeAvatar: "https://i.pravatar.cc/150?u=employee-novapex",
    leaveType: "Annual Leave",
    startDate: "2026-03-18",
    endDate: "2026-03-20",
    days: 3,
    reason: "Family event and travel.",
    status: "Pending",
    appliedDate: "2026-03-02",
    approverEmail: "manager@novapex.com",
    approverName: "Alex Rivera",
  },
  {
    id: "LR-1000",
    companyId: "novapex-hq",
    employeeEmail: "employee2@novapex.com",
    employeeName: "Priya Das",
    employeeDepartment: "Design",
    employeeAvatar: "https://i.pravatar.cc/150?u=employee2-novapex",
    leaveType: "Sick Leave",
    startDate: "2026-02-16",
    endDate: "2026-02-17",
    days: 2,
    reason: "Medical appointment and recovery.",
    status: "Approved",
    appliedDate: "2026-02-14",
    approverEmail: "manager@novapex.com",
    approverName: "Alex Rivera",
    decidedByEmail: "manager@novapex.com",
    decidedAt: "2026-02-14",
  },
  {
    id: "LR-2001",
    companyId: "aster-dynamics",
    employeeEmail: "employee@aster.com",
    employeeName: "Leah Baker",
    employeeDepartment: "Operations",
    employeeAvatar: "https://i.pravatar.cc/150?u=employee-aster",
    leaveType: "Personal Leave",
    startDate: "2026-03-05",
    endDate: "2026-03-05",
    days: 1,
    reason: "Personal work outside office.",
    status: "Pending",
    appliedDate: "2026-03-01",
    approverEmail: "manager@aster.com",
    approverName: "Noah Patel",
  },
]
