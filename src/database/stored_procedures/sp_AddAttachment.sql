CREATE OR ALTER PROCEDURE sp_AddAttachment
    @ArticleId INT,
    @FileName NVARCHAR(255),
    @OriginalFileName NVARCHAR(255),
    @FileSize BIGINT,
    @FileType NVARCHAR(100),
    @FilePath NVARCHAR(500),
    @FileExtension NVARCHAR(10),
    @UploadedBy INT,
    @Description NVARCHAR(500) = NULL,
    @IsImage BIT = 0,
    @ThumbnailPath NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ArticleAttachments (
        ArticleId,
        FileName,
        OriginalFileName,
        FileSize,
        FileType,
        FilePath,
        FileExtension,
        UploadedBy,
        Description,
        IsImage,
        ThumbnailPath,
        UploadedAt
    )
    VALUES (
        @ArticleId,
        @FileName,
        @OriginalFileName,
        @FileSize,
        @FileType,
        @FilePath,
        @FileExtension,
        @UploadedBy,
        @Description,
        @IsImage,
        @ThumbnailPath,
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS AttachmentId;
END
