-- =============================================
-- Phase 1: Seed Data
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- Seed Teams
-- =============================================
IF NOT EXISTS (SELECT 1 FROM Teams)
BEGIN
    INSERT INTO Teams (TeamName, Description) VALUES
    ('Engineering', 'Software engineering team'),
    ('Product', 'Product management team'),
    ('Support', 'Customer support team'),
    ('Sales', 'Sales team'),
    ('Marketing', 'Marketing team');
    
    PRINT 'Teams seeded successfully';
END
GO

-- =============================================
-- Seed Clients
-- =============================================
IF NOT EXISTS (SELECT 1 FROM Clients)
BEGIN
    INSERT INTO Clients (ClientName, Description) VALUES
    ('Acme Corp', 'Acme Corporation'),
    ('TechStart Inc', 'TechStart startup company'),
    ('Global Solutions', 'Global Solutions enterprise'),
    ('Innovation Labs', 'Innovation Labs research company');
    
    PRINT 'Clients seeded successfully';
END
GO

-- =============================================
-- Seed Users
-- Note: Passwords are hashed versions of "Password123!"
-- In production, use proper password hashing
-- =============================================
DECLARE @AdminRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'Admin');
DECLARE @SupportRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'Support');
DECLARE @UserRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'User');

DECLARE @EngineeringTeamId INT = (SELECT TeamId FROM Teams WHERE TeamName = 'Engineering');
DECLARE @SupportTeamId INT = (SELECT TeamId FROM Teams WHERE TeamName = 'Support');
DECLARE @SalesTeamId INT = (SELECT TeamId FROM Teams WHERE TeamName = 'Sales');

DECLARE @AcmeClientId INT = (SELECT ClientId FROM Clients WHERE ClientName = 'Acme Corp');
DECLARE @TechStartClientId INT = (SELECT ClientId FROM Clients WHERE ClientName = 'TechStart Inc');

IF NOT EXISTS (SELECT 1 FROM Users)
BEGIN
    -- Admin User
    INSERT INTO Users (Email, PasswordHash, PasswordSalt, FirstName, LastName, RoleId, TeamId, ClientId)
    VALUES (
        'admin@knowledgebase.com',
        'AQAAAAIAAYagAAAAEMh1YqYZK8xJZ9vK3R0p6GJ7x8yN5XQ2wE4tR6uY8iO3pL1mN7kJ5hF9gD3sC2bV1a', -- Password123!
        'RandomSalt123',
        'Admin',
        'User',
        @AdminRoleId,
        @EngineeringTeamId,
        NULL
    );

    -- Support User
    INSERT INTO Users (Email, PasswordHash, PasswordSalt, FirstName, LastName, RoleId, TeamId, ClientId)
    VALUES (
        'support@knowledgebase.com',
        'AQAAAAIAAYagAAAAEMh1YqYZK8xJZ9vK3R0p6GJ7x8yN5XQ2wE4tR6uY8iO3pL1mN7kJ5hF9gD3sC2bV1a',
        'RandomSalt456',
        'Support',
        'Agent',
        @SupportRoleId,
        @SupportTeamId,
        NULL
    );

    -- Regular Users
    INSERT INTO Users (Email, PasswordHash, PasswordSalt, FirstName, LastName, RoleId, TeamId, ClientId)
    VALUES (
        'user@acme.com',
        'AQAAAAIAAYagAAAAEMh1YqYZK8xJZ9vK3R0p6GJ7x8yN5XQ2wE4tR6uY8iO3pL1mN7kJ5hF9gD3sC2bV1a',
        'RandomSalt789',
        'John',
        'Doe',
        @UserRoleId,
        @SalesTeamId,
        @AcmeClientId
    );

    INSERT INTO Users (Email, PasswordHash, PasswordSalt, FirstName, LastName, RoleId, TeamId, ClientId)
    VALUES (
        'user@techstart.com',
        'AQAAAAIAAYagAAAAEMh1YqYZK8xJZ9vK3R0p6GJ7x8yN5XQ2wE4tR6uY8iO3pL1mN7kJ5hF9gD3sC2bV1a',
        'RandomSalt101',
        'Jane',
        'Smith',
        @UserRoleId,
        @EngineeringTeamId,
        @TechStartClientId
    );

    PRINT 'Users seeded successfully';
END
GO

PRINT 'Phase 1 Seed Data Completed';
