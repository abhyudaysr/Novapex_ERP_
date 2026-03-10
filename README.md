# Novapex ERP

Enterprise HR/ERP platform built with Next.js App Router.

## Current Scope
- Frontend: role-aware UI with advanced glassmorphism/motion styling.
- Backend: tenant-scoped auth (`email + company`) and leave workflow APIs.
- Database: Mongo path removed from runtime flow; MySQL repository is now implemented.

## What Is Implemented
1. Tenant-scoped authentication:
- `/api/user` validates by both `email` and `company`.
- Cross-company identity access is blocked.

2. Leave workflow with company routing:
- `/api/leave` supports `GET`, `POST`, `PATCH`.
- Employee requests route to same-company manager.
- Manager can only decide requests assigned to them.
- HR can view/decide all requests in same company.
- Employee can only cancel own pending requests.

3. Functional report actions:
- `app/dashboard/reports/page.tsx`:
  - `Create Report` now generates live entries.
  - quick tiles navigate to real sections.
  - `Preview` modal + `Download` export now work.
- `app/attendance/reports/page.jsx`:
  - `Filter` menu now works.
  - `Export Report` downloads generated JSON payload.
  - employee `Claim Badge` action now works and downloads certificate text.

4. MySQL runtime integration:
- Added `mysql2`.
- Added pooled client: `lib/mysql/client.ts`.
- `lib/data/user-repository.ts` now has real MySQL query implementation for:
  - user lookup
  - leave listing
  - leave create/update
  - leave balances

## Run Locally
1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm run dev
```
3. Open:
`http://localhost:3000`

## Provider Mode
- In-memory (default): `DB_PROVIDER=memory`
- MySQL: `DB_PROVIDER=mysql`

Set values in `.env`.

## MySQL Setup
1. Configure `.env`:
```bash
DB_PROVIDER=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=novapex_erp
MYSQL_SSL=false
```
2. Create database if missing:
```sql
CREATE DATABASE novapex_erp;
```
3. Run schema:
- execute `lib/mysql/schema.sql` in your MySQL server.
4. Check connectivity:
```bash
npm run db:check
```
5. Verify API health:
- open `/api/test-db` and confirm provider + health.

## Windows Quick Checks
- Check service:
```powershell
Get-Service MySQL80
```
- Check listening port:
```powershell
netstat -ano | findstr :3306
```
- If `mysql` command is not found, use full path:
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

## Important Files
- `app/api/user/route.ts`
- `app/api/leave/route.ts`
- `lib/data/user-repository.ts`
- `lib/mysql/client.ts`
- `lib/mysql/schema.sql`
- `scripts/mysql-health-check.mjs`
