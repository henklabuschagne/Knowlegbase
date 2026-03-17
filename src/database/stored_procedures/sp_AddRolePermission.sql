CREATE OR ALTER PROCEDURE sp_AddRolePermission
    @RoleId INT,
    @Resource NVARCHAR(100),
    @Action NVARCHAR(50),
    @Scope NVARCHAR(50) = 'All',
    @Conditions NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if permission already exists
    IF EXISTS (SELECT 1 FROM RolePermissions WHERE RoleId = @RoleId AND Resource = @Resource AND Action = @Action)
    BEGIN
        -- Update existing permission
        UPDATE RolePermissions
        SET Scope = @Scope,
            Conditions = @Conditions
        WHERE RoleId = @RoleId AND Resource = @Resource AND Action = @Action;
        
        SELECT PermissionId FROM RolePermissions 
        WHERE RoleId = @RoleId AND Resource = @Resource AND Action = @Action;
    END
    ELSE
    BEGIN
        -- Insert new permission
        INSERT INTO RolePermissions (
            RoleId,
            Resource,
            Action,
            Scope,
            Conditions
        )
        VALUES (
            @RoleId,
            @Resource,
            @Action,
            @Scope,
            @Conditions
        );
        
        SELECT SCOPE_IDENTITY() AS PermissionId;
    END
END
