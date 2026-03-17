CREATE PROCEDURE sp_RejectArticle
    @ApprovalId INT,
    @ApproverUserId INT,
    @Comments NVARCHAR(2000)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ArticleId INT, @SubmittedByUserId INT;
    
    SELECT 
        @ArticleId = ArticleId,
        @SubmittedByUserId = SubmittedByUserId
    FROM ArticleApprovals
    WHERE ApprovalId = @ApprovalId;

    -- Update approval record
    UPDATE ArticleApprovals
    SET
        Status = 'Rejected',
        ApproverUserId = @ApproverUserId,
        Comments = @Comments,
        ReviewedAt = GETUTCDATE()
    WHERE ApprovalId = @ApprovalId;

    -- Update article status back to Draft
    UPDATE Articles
    SET StatusId = 1 -- Draft
    WHERE ArticleId = @ArticleId;

    -- Notify the submitter
    DECLARE @ArticleTitle NVARCHAR(500);
    SELECT @ArticleTitle = Title FROM Articles WHERE ArticleId = @ArticleId;

    INSERT INTO Notifications (UserId, Title, Message, NotificationType, RelatedEntityType, RelatedEntityId, CreatedAt)
    VALUES (
        @SubmittedByUserId,
        'Article Rejected',
        'Your article "' + @ArticleTitle + '" has been rejected. Reason: ' + @Comments,
        'ArticleRejected',
        'Article',
        @ArticleId,
        GETUTCDATE()
    );
END;
