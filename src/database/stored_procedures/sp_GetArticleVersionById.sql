CREATE OR ALTER PROCEDURE sp_GetArticleVersionById
    @VersionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        v.VersionId,
        v.ArticleId,
        v.VersionNumber,
        v.Title,
        v.Content,
        v.Summary,
        v.IsInternal,
        v.CreatedBy,
        v.CreatedAt,
        v.ChangeDescription,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        a.Title AS ArticleTitle,
        (
            SELECT t.TagId, t.TagName, t.TagTypeId, tt.TagTypeName, t.ColorCode
            FROM ArticleVersionTags vt
            INNER JOIN Tags t ON vt.TagId = t.TagId
            INNER JOIN TagTypes tt ON t.TagTypeId = tt.TagTypeId
            WHERE vt.VersionId = v.VersionId
            FOR JSON PATH
        ) AS Tags
    FROM ArticleVersions v
    INNER JOIN Users u ON v.CreatedBy = u.UserId
    INNER JOIN Articles a ON v.ArticleId = a.ArticleId
    WHERE v.VersionId = @VersionId;
END
