CREATE OR ALTER PROCEDURE sp_GetAttachmentStats
    @ArticleId INT = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Overall stats
    SELECT 
        COUNT(DISTINCT a.AttachmentId) AS TotalAttachments,
        SUM(a.FileSize) AS TotalStorageBytes,
        SUM(a.DownloadCount) AS TotalDownloads,
        COUNT(DISTINCT CASE WHEN a.IsImage = 1 THEN a.AttachmentId END) AS TotalImages,
        COUNT(DISTINCT CASE WHEN a.IsImage = 0 THEN a.AttachmentId END) AS TotalDocuments
    FROM ArticleAttachments a
    WHERE a.IsDeleted = 0
        AND (@ArticleId IS NULL OR a.ArticleId = @ArticleId);
    
    -- Downloads by file type
    SELECT 
        a.FileExtension,
        COUNT(DISTINCT a.AttachmentId) AS FileCount,
        SUM(a.DownloadCount) AS TotalDownloads,
        SUM(a.FileSize) AS TotalSize
    FROM ArticleAttachments a
    WHERE a.IsDeleted = 0
        AND (@ArticleId IS NULL OR a.ArticleId = @ArticleId)
    GROUP BY a.FileExtension
    ORDER BY TotalDownloads DESC;
    
    -- Top downloaded attachments
    SELECT TOP 10
        a.AttachmentId,
        a.OriginalFileName,
        a.FileType,
        a.FileSize,
        a.DownloadCount,
        a.UploadedAt,
        art.Title AS ArticleTitle
    FROM ArticleAttachments a
    INNER JOIN Articles art ON a.ArticleId = art.ArticleId
    WHERE a.IsDeleted = 0
        AND (@ArticleId IS NULL OR a.ArticleId = @ArticleId)
    ORDER BY a.DownloadCount DESC;
    
    -- Recent downloads
    SELECT TOP 20
        ad.DownloadId,
        ad.AttachmentId,
        a.OriginalFileName,
        ad.UserId,
        u.FirstName + ' ' + u.LastName AS UserName,
        ad.DownloadedAt,
        art.Title AS ArticleTitle
    FROM AttachmentDownloads ad
    INNER JOIN ArticleAttachments a ON ad.AttachmentId = a.AttachmentId
    INNER JOIN Articles art ON a.ArticleId = art.ArticleId
    LEFT JOIN Users u ON ad.UserId = u.UserId
    WHERE (@ArticleId IS NULL OR a.ArticleId = @ArticleId)
        AND (@StartDate IS NULL OR ad.DownloadedAt >= @StartDate)
        AND (@EndDate IS NULL OR ad.DownloadedAt <= @EndDate)
    ORDER BY ad.DownloadedAt DESC;
END
