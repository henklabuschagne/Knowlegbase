CREATE OR ALTER PROCEDURE sp_GetAttachmentById
    @AttachmentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.AttachmentId,
        a.ArticleId,
        a.FileName,
        a.OriginalFileName,
        a.FileSize,
        a.FileType,
        a.FilePath,
        a.FileExtension,
        a.UploadedBy,
        u.FirstName + ' ' + u.LastName AS UploadedByName,
        a.UploadedAt,
        a.Description,
        a.IsImage,
        a.ThumbnailPath,
        a.DownloadCount,
        a.IsDeleted,
        a.DeletedAt,
        a.DeletedBy
    FROM ArticleAttachments a
    INNER JOIN Users u ON a.UploadedBy = u.UserId
    WHERE a.AttachmentId = @AttachmentId;
END
