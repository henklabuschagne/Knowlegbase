CREATE OR ALTER PROCEDURE sp_CheckUserPermission
    @UserId INT,
    @Resource NVARCHAR(100),
    @Action NVARCHAR(50),
    @EntityId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user has permission through custom roles
    SELECT TOP 1
        rp.PermissionId,
        rp.Resource,
        rp.Action,
        rp.Scope,
        rp.Conditions,
        cr.RoleName
    FROM UserCustomRoles ucr
    INNER JOIN CustomRoles cr ON ucr.RoleId = cr.RoleId
    INNER JOIN RolePermissions rp ON cr.RoleId = rp.RoleId
    WHERE ucr.UserId = @UserId
        AND cr.IsActive = 1
        AND (ucr.ExpiresAt IS NULL OR ucr.ExpiresAt > GETUTCDATE())
        AND rp.Resource = @Resource
        AND rp.Action = @Action;
    
    -- Check if user has article-specific permission
    IF @Resource = 'Articles' AND @EntityId IS NOT NULL
    BEGIN
        SELECT 
            ap.PermissionId,
            ap.ArticleId,
            ap.EntityType,
            ap.EntityId,
            ap.PermissionLevel
        FROM ArticlePermissions ap
        WHERE ap.ArticleId = @EntityId
            AND (ap.ExpiresAt IS NULL OR ap.ExpiresAt > GETUTCDATE())
            AND (
                (ap.EntityType = 'User' AND ap.EntityId = @UserId)
                OR (ap.EntityType = 'Team' AND ap.EntityId IN (
                    SELECT TeamId FROM TeamMembers WHERE UserId = @UserId
                ))
                OR (ap.EntityType = 'Role' AND ap.EntityId IN (
                    SELECT RoleId FROM UserCustomRoles WHERE UserId = @UserId
                ))
            );
    END
END
