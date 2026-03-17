CREATE TABLE ArticleVersionTags (
    VersionTagId INT PRIMARY KEY IDENTITY(1,1),
    VersionId INT NOT NULL,
    TagId INT NOT NULL,
    CONSTRAINT FK_ArticleVersionTags_Versions FOREIGN KEY (VersionId) REFERENCES ArticleVersions(VersionId) ON DELETE CASCADE,
    CONSTRAINT FK_ArticleVersionTags_Tags FOREIGN KEY (TagId) REFERENCES Tags(TagId),
    CONSTRAINT UQ_ArticleVersionTags_VersionTag UNIQUE (VersionId, TagId)
);

CREATE INDEX IX_ArticleVersionTags_VersionId ON ArticleVersionTags(VersionId);
CREATE INDEX IX_ArticleVersionTags_TagId ON ArticleVersionTags(TagId);
