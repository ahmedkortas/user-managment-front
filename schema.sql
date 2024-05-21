-- Create the database
CREATE DATABASE IF NOT EXISTS dev;
USE dev;

-- Create the role table with bitmask column
CREATE TABLE IF NOT EXISTS role (
  roleId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  roleName VARCHAR(255) NOT NULL,
  bitmask INT NOT NULL
);

-- Insert roles with bitmask values
INSERT INTO role (roleName, bitmask) VALUES ('Admin', 1);
INSERT INTO role (roleName, bitmask) VALUES ('User', 2);
INSERT INTO role (roleName, bitmask) VALUES ('Guest', 4);
INSERT INTO role (roleName, bitmask) VALUES ('Moderator', 8);
INSERT INTO role (roleName, bitmask) VALUES ('SuperAdmin', 16);
INSERT INTO role (roleName, bitmask) VALUES ('Editor', 32);

-- Create the agency table
CREATE TABLE IF NOT EXISTS agency (
  agencyId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agencyName VARCHAR(255) NOT NULL
);

-- Insert sample data into agency table
INSERT INTO agency (agencyName) VALUES ('Agency1');
INSERT INTO agency (agencyName) VALUES ('Agency2');

-- Create the user table
CREATE TABLE IF NOT EXISTS user (
  userId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(255),
  agencyId BIGINT UNSIGNED,
  FOREIGN KEY (agencyId) REFERENCES agency(agencyId)
);

-- Create the permission table
CREATE TABLE IF NOT EXISTS permission (
  permissionId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  permissionName VARCHAR(255) NOT NULL
);

-- Insert sample data into permission table
INSERT INTO permission (permissionName) VALUES ('Read');
INSERT INTO permission (permissionName) VALUES ('Write');
INSERT INTO permission (permissionName) VALUES ('Execute');

-- Create the user_roles table to represent the many-to-many relationship between users and roles
CREATE TABLE IF NOT EXISTS user_roles (
  userId BIGINT UNSIGNED,
  roleId BIGINT UNSIGNED,
  FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE,
  FOREIGN KEY (roleId) REFERENCES role(roleId) ON DELETE CASCADE,
  PRIMARY KEY (userId, roleId)
);

-- Create the role_permissions table to represent the many-to-many relationship between roles and permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  roleId BIGINT UNSIGNED,
  permissionId BIGINT UNSIGNED,
  FOREIGN KEY (roleId) REFERENCES role(roleId) ON DELETE CASCADE,
  FOREIGN KEY (permissionId) REFERENCES permission(permissionId) ON DELETE CASCADE,
  PRIMARY KEY (roleId, permissionId)
);

-- Create the user_permissions table to represent the many-to-many relationship between users and permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  userId BIGINT UNSIGNED,
  permissionId BIGINT UNSIGNED,
  FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE,
  FOREIGN KEY (permissionId) REFERENCES permission(permissionId) ON DELETE CASCADE,
  PRIMARY KEY (userId, permissionId)
);

-- Insert sample data into user table
INSERT INTO user (username, password, email, phone, status, agencyId) VALUES 
('Alice', 'password1', 'alice@example.com', '1234567890', 'active', 1),
('Bob', 'password2', 'bob@example.com', '0987654321', 'inactive', 2),
('Charlie', 'password3', 'charlie@example.com', '1112223333', 'active', 1);

-- Insert sample data into user_roles table
INSERT INTO user_roles (userId, roleId) VALUES
(1, 1), -- Alice as Admin
(1, 2), -- Alice as User
(2, 2), -- Bob as User
(2, 4), -- Bob as Moderator
(3, 3); -- Charlie as Guest

-- Insert sample data into role_permissions table
INSERT INTO role_permissions (roleId, permissionId) VALUES
(1, 1), -- Admin has Read
(1, 2), -- Admin has Write
(1, 3), -- Admin has Execute
(2, 1), -- User has Read
(4, 1), -- Moderator has Read
(4, 2); -- Moderator has Write

-- Insert sample data into user_permissions table
INSERT INTO user_permissions (userId, permissionId) VALUES
(1, 1), -- Alice has Read
(1, 2), -- Alice has Write
(2, 1), -- Bob has Read
(2, 2), -- Bob has Write
(3, 1); -- Charlie has Read
