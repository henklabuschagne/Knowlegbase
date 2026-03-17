CREATE OR ALTER PROCEDURE sp_CreateTeam
    @TeamName NVARCHAR(200),
    @Description NVARCHAR(500) = NULL,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Teams (
        TeamName,
        Description,
        IsActive,
        CreatedBy,
        CreatedAt,
        UpdatedAt
    )
    VALUES (
        @TeamName,
        @Description,
        1,
        @CreatedBy,
        GETUTCDATE(),
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS TeamId;
END
