CREATE OR ALTER PROCEDURE sp_GetArticleAttachments
    @ArticleId INT,
    @IncludeDeleted BIT = 0
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
        a.DeletedBy,
        du.FirstName + ' ' + du.LastName AS DeletedByName
    FROM ArticleAttachments a
    INNER JOIN Users u ON a.UploadedBy = u.UserId
    LEFT JOIN Users du ON a.DeletedBy = du.UserId
    WHERE a.ArticleId = @ArticleId
        AND (@IncludeDeleted = 1 OR a.IsDeleted = 0)
    ORDER BY a.UploadedAt DESC;
END
