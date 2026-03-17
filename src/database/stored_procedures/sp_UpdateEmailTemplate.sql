CREATE PROCEDURE sp_UpdateEmailTemplate
    @TemplateName NVARCHAR(100),
    @Subject NVARCHAR(200),
    @TemplateContent NVARCHAR(MAX),
    @Description NVARCHAR(500) = NULL,
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE EmailTemplates
    SET 
        Subject = @Subject,
        TemplateContent = @TemplateContent,
        Description = ISNULL(@Description, Description),
        IsActive = @IsActive,
        UpdatedAt = GETUTCDATE()
    WHERE TemplateName = @TemplateName;

    IF @@ROWCOUNT = 0
    BEGIN
        -- Template doesn't exist, insert it
        INSERT INTO EmailTemplates (TemplateName, Subject, TemplateContent, Description, IsActive)
        VALUES (@TemplateName, @Subject, @TemplateContent, @Description, @IsActive);
    END
END
