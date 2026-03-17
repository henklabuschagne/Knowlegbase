CREATE OR ALTER PROCEDURE sp_DeleteAttachment
    @AttachmentId INT,
    @DeletedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ArticleAttachments
    SET IsDeleted = 1,
        DeletedAt = GETUTCDATE(),
        DeletedBy = @DeletedBy
    WHERE AttachmentId = @AttachmentId;
    
    SELECT @@ROWCOUNT AS DeletedCount;
END
