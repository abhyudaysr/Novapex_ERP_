export type UserRole = "hr" | "manager" | "employee"

export interface UserRecord {
  email: string
  name: string
  role: UserRole
  dept: string
  companyId: string
  companyName: string
  companyLogo: string
  managerEmail?: string
  avatar?: string
}

export const MOCK_USERS: UserRecord[] = [
  {
    email: "hr@novapex.com",
    name: "Sarah Johnson",
    role: "hr",
    dept: "Human Resources",
    companyId: "novapex-hq",
    companyName: "Novapex Systems",
    companyLogo: "",
    avatar: "https://i.pravatar.cc/150?u=hr-novapex",
  },
  {
    email: "manager@novapex.com",
    name: "Alex Rivera",
    role: "manager",
    dept: "Engineering",
    companyId: "novapex-hq",
    companyName: "Novapex Systems",
    companyLogo: "",
    avatar: "https://i.pravatar.cc/150?u=manager-novapex",
  },
  {
    email: "employee@novapex.com",
    name: "Jordan Smith",
    role: "employee",
    dept: "Engineering",
    companyId: "novapex-hq",
    companyName: "Novapex Systems",
    companyLogo: "",
    managerEmail: "manager@novapex.com",
    avatar: "https://i.pravatar.cc/150?u=employee-novapex",
  },
  {
    email: "employee2@novapex.com",
    name: "Priya Das",
    role: "employee",
    dept: "Design",
    companyId: "novapex-hq",
    companyName: "Novapex Systems",
    companyLogo: "",
    managerEmail: "manager@novapex.com",
    avatar: "https://i.pravatar.cc/150?u=employee2-novapex",
  },
  {
    email: "hr@aster.com",
    name: "Mira Collins",
    role: "hr",
    dept: "Human Resources",
    companyId: "aster-dynamics",
    companyName: "Aster Dynamics",
    companyLogo: "",
    avatar: "https://i.pravatar.cc/150?u=hr-aster",
  },
  {
    email: "manager@aster.com",
    name: "Noah Patel",
    role: "manager",
    dept: "Operations",
    companyId: "aster-dynamics",
    companyName: "Aster Dynamics",
    companyLogo: "",
    avatar: "https://i.pravatar.cc/150?u=manager-aster",
  },
  {
    email: "employee@aster.com",
    name: "Leah Baker",
    role: "employee",
    dept: "Operations",
    companyId: "aster-dynamics",
    companyName: "Aster Dynamics",
    companyLogo: "",
    managerEmail: "manager@aster.com",
    avatar: "https://i.pravatar.cc/150?u=employee-aster",
  },
]
