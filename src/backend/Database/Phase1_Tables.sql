-- =============================================
-- Phase 1: Core Authentication & Users
-- Database Tables
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- Table: Roles
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        RoleId INT PRIMARY KEY IDENTITY(1,1),
        RoleName NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255),
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        IsActive BIT DEFAULT 1
    );

    -- Insert default roles
    INSERT INTO Roles (RoleName, Description) VALUES
    ('User', 'Standard user with read access'),
    ('Support', 'Support user with review capabilities'),
    ('Admin', 'Administrator with full access');
END
GO

-- =============================================
-- Table: Teams
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Teams')
BEGIN
    CREATE TABLE Teams (
        TeamId INT PRIMARY KEY IDENTITY(1,1),
        TeamName NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500),
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        IsActive BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Table: Clients
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Clients')
BEGIN
    CREATE TABLE Clients (
        ClientId INT PRIMARY KEY IDENTITY(1,1),
        ClientName NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500),
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        IsActive BIT DEFAULT 1
    );
END
GO

-- =============================================
-- Table: Users
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId INT PRIMARY KEY IDENTITY(1,1),
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        PasswordSalt NVARCHAR(255) NOT NULL,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        RoleId INT NOT NULL,
        TeamId INT NULL,
        ClientId INT NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
        LastLoginAt DATETIME2 NULL,
        
        CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),
        CONSTRAINT FK_Users_Teams FOREIGN KEY (TeamId) REFERENCES Teams(TeamId),
        CONSTRAINT FK_Users_Clients FOREIGN KEY (ClientId) REFERENCES Clients(ClientId)
    );

    -- Create indexes
    CREATE INDEX IX_Users_Email ON Users(Email);
    CREATE INDEX IX_Users_RoleId ON Users(RoleId);
    CREATE INDEX IX_Users_TeamId ON Users(TeamId);
    CREATE INDEX IX_Users_ClientId ON Users(ClientId);
END
GO

-- =============================================
-- Table: RefreshTokens (for JWT refresh)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RefreshTokens')
BEGIN
    CREATE TABLE RefreshTokens (
        RefreshTokenId INT PRIMARY KEY IDENTITY(1,1),
        UserId INT NOT NULL,
        Token NVARCHAR(500) NOT NULL UNIQUE,
        ExpiresAt DATETIME2 NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        RevokedAt DATETIME2 NULL,
        IsRevoked BIT DEFAULT 0,
        
        CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );

    -- Create indexes
    CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
    CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
END
GO

PRINT 'Phase 1 Tables Created Successfully';
