CREATE OR ALTER PROCEDURE sp_GetArticleVersions
    @ArticleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        v.VersionId,
        v.ArticleId,
        v.VersionNumber,
        v.Title,
        v.Summary,
        v.IsInternal,
        v.CreatedBy,
        v.CreatedAt,
        v.ChangeDescription,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        (
            SELECT STRING_AGG(CAST(TagId AS NVARCHAR(10)), ',')
            FROM ArticleVersionTags
            WHERE VersionId = v.VersionId
        ) AS TagIds
    FROM ArticleVersions v
    INNER JOIN Users u ON v.CreatedBy = u.UserId
    WHERE v.ArticleId = @ArticleId
    ORDER BY v.VersionNumber DESC;
END
