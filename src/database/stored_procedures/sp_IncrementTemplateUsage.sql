CREATE OR ALTER PROCEDURE sp_IncrementTemplateUsage
    @TemplateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ArticleTemplates
    SET UsageCount = UsageCount + 1
    WHERE TemplateId = @TemplateId;
    
    SELECT @@ROWCOUNT AS UpdatedCount;
END
