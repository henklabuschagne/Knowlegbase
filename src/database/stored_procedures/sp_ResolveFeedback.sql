CREATE OR ALTER PROCEDURE sp_ResolveFeedback
    @FeedbackId INT,
    @ResolvedBy INT,
    @ResolutionNotes NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ArticleFeedback
    SET IsResolved = 1,
        ResolvedBy = @ResolvedBy,
        ResolvedAt = GETUTCDATE(),
        ResolutionNotes = @ResolutionNotes
    WHERE FeedbackId = @FeedbackId;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
