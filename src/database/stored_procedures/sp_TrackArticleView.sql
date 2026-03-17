CREATE OR ALTER PROCEDURE sp_TrackArticleView
    @ArticleId INT,
    @UserId INT = NULL,
    @SessionId NVARCHAR(100) = NULL,
    @UserAgent NVARCHAR(500) = NULL,
    @IpAddress NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Insert view record
        INSERT INTO ArticleViews (ArticleId, UserId, ViewedAt, SessionId, UserAgent, IpAddress)
        VALUES (@ArticleId, @UserId, GETUTCDATE(), @SessionId, @UserAgent, @IpAddress);
        
        -- Update article metrics
        IF NOT EXISTS (SELECT 1 FROM ArticleMetrics WHERE ArticleId = @ArticleId)
        BEGIN
            INSERT INTO ArticleMetrics (ArticleId, TotalViews, UniqueViews, LastViewedAt, UpdatedAt)
            VALUES (@ArticleId, 1, 1, GETUTCDATE(), GETUTCDATE());
        END
        ELSE
        BEGIN
            -- Count unique views by session and user
            DECLARE @UniqueViews INT;
            SELECT @UniqueViews = COUNT(DISTINCT COALESCE(CAST(UserId AS NVARCHAR), SessionId))
            FROM ArticleViews
            WHERE ArticleId = @ArticleId;
            
            UPDATE ArticleMetrics
            SET TotalViews = TotalViews + 1,
                UniqueViews = @UniqueViews,
                LastViewedAt = GETUTCDATE(),
                UpdatedAt = GETUTCDATE()
            WHERE ArticleId = @ArticleId;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
