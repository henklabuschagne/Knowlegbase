CREATE OR ALTER PROCEDURE sp_GetEmailTemplate
    @TemplateName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TemplateId,
        TemplateName,
        Subject,
        BodyHtml,
        BodyText,
        Description,
        IsActive
    FROM EmailTemplates
    WHERE TemplateName = @TemplateName
        AND IsActive = 1;
END
