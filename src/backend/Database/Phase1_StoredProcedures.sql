-- =============================================
-- Phase 1: Core Authentication & Users
-- Stored Procedures
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- SP: Create User
-- =============================================
CREATE OR ALTER PROCEDURE sp_CreateUser
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @PasswordSalt NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @RoleId INT,
    @TeamId INT = NULL,
    @ClientId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            THROW 50001, 'Email already exists', 1;
        END
        
        -- Insert user
        INSERT INTO Users (Email, PasswordHash, PasswordSalt, FirstName, LastName, RoleId, TeamId, ClientId)
        VALUES (@Email, @PasswordHash, @PasswordSalt, @FirstName, @LastName, @RoleId, @TeamId, @ClientId);
        
        -- Return the created user
        SELECT 
            UserId,
            Email,
            FirstName,
            LastName,
            RoleId,
            TeamId,
            ClientId,
            IsActive,
            CreatedAt,
            UpdatedAt
        FROM Users
        WHERE UserId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- SP: Get User By Email
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetUserByEmail
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.UserId,
        u.Email,
        u.PasswordHash,
        u.PasswordSalt,
        u.FirstName,
        u.LastName,
        u.RoleId,
        r.RoleName,
        u.TeamId,
        t.TeamName,
        u.ClientId,
        c.ClientName,
        u.IsActive,
        u.CreatedAt,
        u.UpdatedAt,
        u.LastLoginAt
    FROM Users u
    INNER JOIN Roles r ON u.RoleId = r.RoleId
    LEFT JOIN Teams t ON u.TeamId = t.TeamId
    LEFT JOIN Clients c ON u.ClientId = c.ClientId
    WHERE u.Email = @Email AND u.IsActive = 1;
END
GO

-- =============================================
-- SP: Get User By Id
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.UserId,
        u.Email,
        u.FirstName,
        u.LastName,
        u.RoleId,
        r.RoleName,
        u.TeamId,
        t.TeamName,
        u.ClientId,
        c.ClientName,
        u.IsActive,
        u.CreatedAt,
        u.UpdatedAt,
        u.LastLoginAt
    FROM Users u
    INNER JOIN Roles r ON u.RoleId = r.RoleId
    LEFT JOIN Teams t ON u.TeamId = t.TeamId
    LEFT JOIN Clients c ON u.ClientId = c.ClientId
    WHERE u.UserId = @UserId;
END
GO

-- =============================================
-- SP: Update Last Login
-- =============================================
CREATE OR ALTER PROCEDURE sp_UpdateLastLogin
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET LastLoginAt = GETUTCDATE()
    WHERE UserId = @UserId;
END
GO

-- =============================================
-- SP: Update User Profile
-- =============================================
CREATE OR ALTER PROCEDURE sp_UpdateUserProfile
    @UserId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @TeamId INT = NULL,
    @ClientId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE Users
        SET 
            FirstName = @FirstName,
            LastName = @LastName,
            TeamId = @TeamId,
            ClientId = @ClientId,
            UpdatedAt = GETUTCDATE()
        WHERE UserId = @UserId;
        
        -- Return updated user
        EXEC sp_GetUserById @UserId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- SP: Change Password
-- =============================================
CREATE OR ALTER PROCEDURE sp_ChangePassword
    @UserId INT,
    @NewPasswordHash NVARCHAR(255),
    @NewPasswordSalt NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET 
        PasswordHash = @NewPasswordHash,
        PasswordSalt = @NewPasswordSalt,
        UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- SP: Create Refresh Token
-- =============================================
CREATE OR ALTER PROCEDURE sp_CreateRefreshToken
    @UserId INT,
    @Token NVARCHAR(500),
    @ExpiresAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO RefreshTokens (UserId, Token, ExpiresAt)
    VALUES (@UserId, @Token, @ExpiresAt);
    
    SELECT 
        RefreshTokenId,
        UserId,
        Token,
        ExpiresAt,
        CreatedAt,
        IsRevoked
    FROM RefreshTokens
    WHERE RefreshTokenId = SCOPE_IDENTITY();
END
GO

-- =============================================
-- SP: Validate Refresh Token
-- =============================================
CREATE OR ALTER PROCEDURE sp_ValidateRefreshToken
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        rt.RefreshTokenId,
        rt.UserId,
        rt.Token,
        rt.ExpiresAt,
        rt.IsRevoked,
        u.Email,
        u.FirstName,
        u.LastName,
        u.RoleId,
        r.RoleName
    FROM RefreshTokens rt
    INNER JOIN Users u ON rt.UserId = u.UserId
    INNER JOIN Roles r ON u.RoleId = r.RoleId
    WHERE rt.Token = @Token 
        AND rt.IsRevoked = 0 
        AND rt.ExpiresAt > GETUTCDATE()
        AND u.IsActive = 1;
END
GO

-- =============================================
-- SP: Revoke Refresh Token
-- =============================================
CREATE OR ALTER PROCEDURE sp_RevokeRefreshToken
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE RefreshTokens
    SET 
        IsRevoked = 1,
        RevokedAt = GETUTCDATE()
    WHERE Token = @Token;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- SP: Get All Roles
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetAllRoles
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        RoleId,
        RoleName,
        Description,
        CreatedAt,
        IsActive
    FROM Roles
    WHERE IsActive = 1
    ORDER BY RoleName;
END
GO

-- =============================================
-- SP: Get All Teams
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetAllTeams
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TeamId,
        TeamName,
        Description,
        CreatedAt,
        IsActive
    FROM Teams
    WHERE IsActive = 1
    ORDER BY TeamName;
END
GO

-- =============================================
-- SP: Get All Clients
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetAllClients
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClientId,
        ClientName,
        Description,
        CreatedAt,
        IsActive
    FROM Clients
    WHERE IsActive = 1
    ORDER BY ClientName;
END
GO

PRINT 'Phase 1 Stored Procedures Created Successfully';
