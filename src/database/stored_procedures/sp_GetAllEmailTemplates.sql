CREATE PROCEDURE sp_GetAllEmailTemplates
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TemplateId,
        TemplateName,
        Subject,
        TemplateContent,
        Description,
        Variables,
        IsActive,
        CreatedAt,
        UpdatedAt
    FROM EmailTemplates
    WHERE IsActive = 1
    ORDER BY TemplateName;
END
