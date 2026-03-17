CREATE OR ALTER PROCEDURE sp_UpdateAttachment
    @AttachmentId INT,
    @Description NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ArticleAttachments
    SET Description = @Description
    WHERE AttachmentId = @AttachmentId;
    
    SELECT @@ROWCOUNT AS UpdatedCount;
END
