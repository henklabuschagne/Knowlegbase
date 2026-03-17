CREATE OR ALTER PROCEDURE sp_AddTeamMember
    @TeamId INT,
    @UserId INT,
    @TeamRole NVARCHAR(50) = 'Member'
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO TeamMembers (
        TeamId,
        UserId,
        TeamRole,
        JoinedAt
    )
    VALUES (
        @TeamId,
        @UserId,
        @TeamRole,
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS TeamMemberId;
END
