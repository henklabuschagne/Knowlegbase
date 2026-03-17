CREATE TABLE ArticlePermissions (
    PermissionId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    EntityType NVARCHAR(20) NOT NULL, -- User, Team, Role
    EntityId INT NOT NULL,
    PermissionLevel NVARCHAR(20) NOT NULL, -- View, Edit, Admin
    GrantedBy INT NOT NULL,
    GrantedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2 NULL,
    CONSTRAINT FK_ArticlePermissions_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId) ON DELETE CASCADE,
    CONSTRAINT FK_ArticlePermissions_GrantedBy FOREIGN KEY (GrantedBy) REFERENCES Users(UserId),
    CONSTRAINT UQ_ArticlePermissions UNIQUE (ArticleId, EntityType, EntityId)
);

CREATE INDEX IX_ArticlePermissions_ArticleId ON ArticlePermissions(ArticleId);
CREATE INDEX IX_ArticlePermissions_EntityType ON ArticlePermissions(EntityType);
CREATE INDEX IX_ArticlePermissions_EntityId ON ArticlePermissions(EntityId);
CREATE INDEX IX_ArticlePermissions_ExpiresAt ON ArticlePermissions(ExpiresAt);
