import fs from "node:fs"
import mysql from "mysql2/promise"

function readEnvFile(path) {
  if (!fs.existsSync(path)) return {}
  const text = fs.readFileSync(path, "utf8")
  return text.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return acc
    const idx = trimmed.indexOf("=")
    if (idx <= 0) return acc
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    acc[key] = value
    return acc
  }, {})
}

function mergedEnv() {
  const fileEnv = readEnvFile(".env")
  return {
    ...fileEnv,
    ...process.env,
  }
}

async function run() {
  const env = mergedEnv()
  const config = {
    host: env.MYSQL_HOST || "127.0.0.1",
    port: Number(env.MYSQL_PORT || "3306"),
    user: env.MYSQL_USER || "root",
    password: env.MYSQL_PASSWORD || "",
    database: env.MYSQL_DATABASE || "",
  }

  console.log("Checking MySQL server...")
  console.log(`Host: ${config.host}`)
  console.log(`Port: ${config.port}`)
  console.log(`User: ${config.user}`)
  console.log(`Database: ${config.database || "(not set)"}`)

  let connection
  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      connectTimeout: 5000,
    })
  } catch (error) {
    console.error("\nMySQL connection failed.")
    console.error(String(error?.message || error))
    process.exitCode = 1
    return
  }

  try {
    const [dbRows] = await connection.query("SHOW DATABASES")
    const databaseNames = dbRows.map((row) => Object.values(row)[0])
    const hasDatabase = config.database ? databaseNames.includes(config.database) : false

    console.log("\nMySQL server is reachable.")
    console.log(`Database exists: ${hasDatabase ? "yes" : "no"}`)

    if (config.database && hasDatabase) {
      await connection.query(`USE \`${config.database}\``)
      const [tableRows] = await connection.query("SHOW TABLES")
      const tables = tableRows.map((row) => Object.values(row)[0])
      console.log(`Tables found: ${tables.length}`)
      if (tables.length) {
        console.log(`Table list: ${tables.join(", ")}`)
      }
    } else if (config.database) {
      console.log(`Create it first: CREATE DATABASE ${config.database};`)
    }
  } finally {
    await connection.end()
  }
}

run()
