CREATE OR ALTER PROCEDURE sp_RecordAttachmentDownload
    @AttachmentId INT,
    @UserId INT = NULL,
    @IpAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    -- Record the download
    INSERT INTO AttachmentDownloads (AttachmentId, UserId, IpAddress, UserAgent, DownloadedAt)
    VALUES (@AttachmentId, @UserId, @IpAddress, @UserAgent, GETUTCDATE());
    
    -- Update download count
    UPDATE ArticleAttachments
    SET DownloadCount = DownloadCount + 1
    WHERE AttachmentId = @AttachmentId;
    
    COMMIT TRANSACTION;
    
    SELECT SCOPE_IDENTITY() AS DownloadId;
END
