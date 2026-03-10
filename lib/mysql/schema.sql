-- Novapex ERP MySQL baseline schema (scaffold)
-- Execute manually in your MySQL instance after backend wiring is ready.

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  logo_url VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  company_id VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(180) NOT NULL,
  role ENUM('hr', 'manager', 'employee') NOT NULL DEFAULT 'employee',
  dept VARCHAR(120) NOT NULL,
  manager_email VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_company_email (company_id, email),
  CONSTRAINT fk_users_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_users_company_role ON users(company_id, role);
CREATE INDEX idx_users_company_email ON users(company_id, email);

CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  request_code VARCHAR(40) NOT NULL UNIQUE,
  company_id VARCHAR(64) NOT NULL,
  employee_email VARCHAR(255) NOT NULL,
  approver_email VARCHAR(255) NOT NULL,
  leave_type ENUM('Annual Leave', 'Sick Leave', 'Personal Leave') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days SMALLINT UNSIGNED NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP NULL,
  decided_by_email VARCHAR(255) NULL,
  CONSTRAINT fk_leave_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_leave_company_status ON leave_requests(company_id, status);
CREATE INDEX idx_leave_company_employee ON leave_requests(company_id, employee_email);
CREATE INDEX idx_leave_company_approver ON leave_requests(company_id, approver_email);

CREATE TABLE IF NOT EXISTS leave_balances (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  company_id VARCHAR(64) NOT NULL,
  employee_email VARCHAR(255) NOT NULL,
  annual_used SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  annual_total SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  sick_used SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  sick_total SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  personal_used SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  personal_total SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_leave_balances_company_employee (company_id, employee_email),
  CONSTRAINT fk_leave_balances_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE
);
