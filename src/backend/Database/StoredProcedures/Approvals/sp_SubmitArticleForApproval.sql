CREATE PROCEDURE sp_SubmitArticleForApproval
    @ArticleId INT,
    @ArticleVersionId INT,
    @SubmittedByUserId INT,
    @ApprovalLevel INT = 1 -- 1=Support Review, 2=Admin Final
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if there's already a pending approval at this level
    IF EXISTS (
        SELECT 1 FROM ArticleApprovals 
        WHERE ArticleId = @ArticleId 
            AND ApprovalLevel = @ApprovalLevel 
            AND Status = 'Pending'
    )
    BEGIN
        RAISERROR('An approval is already pending for this article at this level', 16, 1);
        RETURN;
    END

    -- Create approval record
    INSERT INTO ArticleApprovals (
        ArticleId,
        ArticleVersionId,
        SubmittedByUserId,
        ApprovalLevel,
        Status,
        SubmittedAt
    )
    VALUES (
        @ArticleId,
        @ArticleVersionId,
        @SubmittedByUserId,
        @ApprovalLevel,
        'Pending',
        GETUTCDATE()
    );

    DECLARE @ApprovalId INT = SCOPE_IDENTITY();

    -- Update article status to Pending Review
    UPDATE Articles
    SET StatusId = 2 -- Pending Review
    WHERE ArticleId = @ArticleId;

    -- Notify approvers
    DECLARE @ArticleTitle NVARCHAR(500);
    SELECT @ArticleTitle = Title FROM Articles WHERE ArticleId = @ArticleId;

    DECLARE @RequiredRole NVARCHAR(50) = CASE WHEN @ApprovalLevel = 1 THEN 'Support' ELSE 'Admin' END;

    INSERT INTO Notifications (UserId, Title, Message, NotificationType, RelatedEntityType, RelatedEntityId, CreatedAt)
    SELECT 
        u.UserId,
        'Article Pending Approval',
        'Article "' + @ArticleTitle + '" is pending your approval',
        'ArticleApproval',
        'Article',
        @ArticleId,
        GETUTCDATE()
    FROM Users u
    WHERE u.Role = @RequiredRole OR u.Role = 'Admin';

    SELECT @ApprovalId AS ApprovalId;
END;
