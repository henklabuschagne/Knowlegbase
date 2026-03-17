CREATE OR ALTER PROCEDURE sp_SubmitArticleFeedback
    @ArticleId INT,
    @UserId INT,
    @Rating INT,
    @IsHelpful BIT = NULL,
    @FeedbackText NVARCHAR(2000) = NULL,
    @Category NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @FeedbackId INT;
        DECLARE @ExistingFeedbackId INT;
        
        -- Check if user already provided feedback for this article
        SELECT @ExistingFeedbackId = FeedbackId
        FROM ArticleFeedback
        WHERE ArticleId = @ArticleId AND UserId = @UserId;
        
        IF @ExistingFeedbackId IS NOT NULL
        BEGIN
            -- Update existing feedback
            UPDATE ArticleFeedback
            SET Rating = @Rating,
                IsHelpful = @IsHelpful,
                FeedbackText = @FeedbackText,
                Category = @Category,
                UpdatedAt = GETUTCDATE()
            WHERE FeedbackId = @ExistingFeedbackId;
            
            SET @FeedbackId = @ExistingFeedbackId;
        END
        ELSE
        BEGIN
            -- Insert new feedback
            INSERT INTO ArticleFeedback (ArticleId, UserId, Rating, IsHelpful, FeedbackText, Category, CreatedAt)
            VALUES (@ArticleId, @UserId, @Rating, @IsHelpful, @FeedbackText, @Category, GETUTCDATE());
            
            SET @FeedbackId = SCOPE_IDENTITY();
        END
        
        -- Update or create article metrics
        IF NOT EXISTS (SELECT 1 FROM ArticleMetrics WHERE ArticleId = @ArticleId)
        BEGIN
            INSERT INTO ArticleMetrics (ArticleId, TotalFeedback, LastFeedbackAt, UpdatedAt)
            VALUES (@ArticleId, 0, GETUTCDATE(), GETUTCDATE());
        END
        
        -- Recalculate metrics
        UPDATE ArticleMetrics
        SET TotalFeedback = (SELECT COUNT(*) FROM ArticleFeedback WHERE ArticleId = @ArticleId),
            AverageRating = (SELECT AVG(CAST(Rating AS DECIMAL(3,2))) FROM ArticleFeedback WHERE ArticleId = @ArticleId),
            HelpfulCount = (SELECT COUNT(*) FROM ArticleFeedback WHERE ArticleId = @ArticleId AND IsHelpful = 1),
            NotHelpfulCount = (SELECT COUNT(*) FROM ArticleFeedback WHERE ArticleId = @ArticleId AND IsHelpful = 0),
            LastFeedbackAt = GETUTCDATE(),
            UpdatedAt = GETUTCDATE()
        WHERE ArticleId = @ArticleId;
        
        COMMIT TRANSACTION;
        
        SELECT @FeedbackId AS FeedbackId;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
