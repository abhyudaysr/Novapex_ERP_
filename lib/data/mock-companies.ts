export interface CompanyRecord {
  id: string
  name: string
  logoUrl: string
  aliases: string[]
}

export const MOCK_COMPANIES: CompanyRecord[] = [
  {
    id: "novapex-hq",
    name: "Novapex Systems",
    logoUrl: "",
    aliases: ["novapex", "novapex systems", "novapex hq"],
  },
  {
    id: "aster-dynamics",
    name: "Aster Dynamics",
    logoUrl: "",
    aliases: ["aster", "aster dynamics", "aster labs"],
  },
]
