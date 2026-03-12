import mysql, { type Pool } from "mysql2/promise"

declare global {
  var __novapexMysqlPool: Pool | undefined
}

interface MySqlConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  ssl: boolean
}

function readMySqlConfig(): MySqlConfig {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "",
    ssl: String(process.env.MYSQL_SSL || "false").toLowerCase() === "true",
  }
}

export function isMySqlConfigured(): boolean {
  const config = readMySqlConfig()
  return Boolean(config.database && config.user && config.host && config.port)
}

export function getMySqlPool(): Pool {
  if (!global.__novapexMysqlPool) {
    const config = readMySqlConfig()
    if (!config.database) {
      throw new Error("MYSQL_DATABASE is not configured.")
    }

    global.__novapexMysqlPool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_POOL_SIZE || "10"),
      queueLimit: 0,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    })
  }

  return global.__novapexMysqlPool
}

export async function pingMySql(): Promise<void> {
  const pool = getMySqlPool()
  await pool.query("SELECT 1")
}
