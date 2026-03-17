CREATE OR ALTER PROCEDURE sp_GetUserArticleFeedback
    @ArticleId INT,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        f.FeedbackId,
        f.ArticleId,
        f.UserId,
        f.Rating,
        f.IsHelpful,
        f.FeedbackText,
        f.Category,
        f.CreatedAt,
        f.UpdatedAt
    FROM ArticleFeedback f
    WHERE f.ArticleId = @ArticleId AND f.UserId = @UserId;
END
