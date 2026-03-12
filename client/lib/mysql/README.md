# MySQL Runtime Notes

This project now supports a real MySQL repository implementation.

## Files
- `lib/mysql/client.ts`: pooled MySQL client (`mysql2/promise`)
- `lib/mysql/schema.sql`: baseline tenant + leave schema
- `scripts/mysql-health-check.mjs`: CLI connectivity check

## Provider Switch
- `DB_PROVIDER=memory`: in-memory datasets
- `DB_PROVIDER=mysql`: MySQL queries are used

## Required Env
```bash
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=novapex_erp
MYSQL_SSL=false
MYSQL_POOL_SIZE=10
```

## Validation Flow
1. Run schema (`lib/mysql/schema.sql`).
2. Run:
```bash
npm run db:check
```
3. Start app with:
```bash
DB_PROVIDER=mysql npm run dev
```
4. Open:
- `/api/test-db`
- `/api/user` via login flow
- `/api/leave` via leave screens
