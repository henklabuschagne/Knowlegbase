CREATE OR ALTER PROCEDURE sp_CreateCustomRole
    @RoleName NVARCHAR(100),
    @Description NVARCHAR(500) = NULL,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO CustomRoles (
        RoleName,
        Description,
        IsActive,
        CreatedBy,
        CreatedAt,
        UpdatedAt
    )
    VALUES (
        @RoleName,
        @Description,
        1,
        @CreatedBy,
        GETUTCDATE(),
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS RoleId;
END
