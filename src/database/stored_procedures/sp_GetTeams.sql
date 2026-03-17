CREATE OR ALTER PROCEDURE sp_GetTeams
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.TeamId,
        t.TeamName,
        t.Description,
        t.IsActive,
        t.CreatedBy,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        t.CreatedAt,
        t.UpdatedAt,
        COUNT(tm.TeamMemberId) AS MemberCount
    FROM Teams t
    INNER JOIN Users u ON t.CreatedBy = u.UserId
    LEFT JOIN TeamMembers tm ON t.TeamId = tm.TeamId
    WHERE (@IsActive IS NULL OR t.IsActive = @IsActive)
    GROUP BY t.TeamId, t.TeamName, t.Description, t.IsActive, t.CreatedBy, 
             u.FirstName, u.LastName, t.CreatedAt, t.UpdatedAt
    ORDER BY t.TeamName ASC;
END
