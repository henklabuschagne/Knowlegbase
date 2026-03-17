CREATE PROCEDURE sp_CreateArticleRequest
    @Title NVARCHAR(500),
    @Description NVARCHAR(MAX),
    @RequestedByUserId INT,
    @Priority INT = 2
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ArticleRequests (
        Title,
        Description,
        RequestedByUserId,
        Priority,
        StatusId,
        CreatedAt,
        UpdatedAt
    )
    VALUES (
        @Title,
        @Description,
        @RequestedByUserId,
        @Priority,
        1, -- Open status
        GETUTCDATE(),
        GETUTCDATE()
    );

    DECLARE @RequestId INT = SCOPE_IDENTITY();

    -- Create notification for support/admin users
    INSERT INTO Notifications (UserId, Title, Message, NotificationType, RelatedEntityType, RelatedEntityId, CreatedAt)
    SELECT 
        u.UserId,
        'New Article Request',
        'New article request: ' + @Title,
        'ArticleRequest',
        'Request',
        @RequestId,
        GETUTCDATE()
    FROM Users u
    WHERE u.Role IN ('Support', 'Admin');

    -- Return the created request
    EXEC sp_GetArticleRequestById @RequestId;
END;
