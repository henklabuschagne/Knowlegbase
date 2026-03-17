CREATE PROCEDURE sp_ApproveArticle
    @ApprovalId INT,
    @ApproverUserId INT,
    @Comments NVARCHAR(2000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ArticleId INT, @ApprovalLevel INT, @SubmittedByUserId INT;
    
    SELECT 
        @ArticleId = ArticleId,
        @ApprovalLevel = ApprovalLevel,
        @SubmittedByUserId = SubmittedByUserId
    FROM ArticleApprovals
    WHERE ApprovalId = @ApprovalId;

    -- Update approval record
    UPDATE ArticleApprovals
    SET
        Status = 'Approved',
        ApproverUserId = @ApproverUserId,
        Comments = @Comments,
        ReviewedAt = GETUTCDATE()
    WHERE ApprovalId = @ApprovalId;

    -- If this is final approval (Level 2 or Admin approval on Level 1), update article status
    DECLARE @ApproverRole NVARCHAR(50);
    SELECT @ApproverRole = Role FROM Users WHERE UserId = @ApproverUserId;

    IF @ApprovalLevel = 2 OR (@ApprovalLevel = 1 AND @ApproverRole = 'Admin')
    BEGIN
        -- Update article to Approved status
        UPDATE Articles
        SET StatusId = 3 -- Approved
        WHERE ArticleId = @ArticleId;
    END
    ELSE IF @ApprovalLevel = 1
    BEGIN
        -- Support approved, need admin final approval
        -- Submit for level 2 approval
        DECLARE @ArticleVersionId INT;
        SELECT @ArticleVersionId = ArticleVersionId 
        FROM ArticleApprovals 
        WHERE ApprovalId = @ApprovalId;

        EXEC sp_SubmitArticleForApproval 
            @ArticleId = @ArticleId,
            @ArticleVersionId = @ArticleVersionId,
            @SubmittedByUserId = @ApproverUserId,
            @ApprovalLevel = 2;
    END

    -- Notify the submitter
    DECLARE @ArticleTitle NVARCHAR(500);
    SELECT @ArticleTitle = Title FROM Articles WHERE ArticleId = @ArticleId;

    INSERT INTO Notifications (UserId, Title, Message, NotificationType, RelatedEntityType, RelatedEntityId, CreatedAt)
    VALUES (
        @SubmittedByUserId,
        'Article Approved',
        'Your article "' + @ArticleTitle + '" has been approved',
        'ArticleApproved',
        'Article',
        @ArticleId,
        GETUTCDATE()
    );
END;
