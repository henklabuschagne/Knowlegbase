CREATE TABLE UserActivity (
    ActivityId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    ActivityType NVARCHAR(100) NOT NULL, -- 'Login', 'ArticleView', 'ArticleCreate', 'ArticleEdit', 'Search', 'FeedbackSubmit', etc.
    EntityType NVARCHAR(50) NULL, -- 'Article', 'Request', 'Approval', etc.
    EntityId INT NULL,
    Details NVARCHAR(MAX) NULL, -- JSON with additional context
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    SessionId NVARCHAR(100) NULL,
    CONSTRAINT FK_UserActivity_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_UserActivity_UserId ON UserActivity(UserId);
CREATE INDEX IX_UserActivity_CreatedAt ON UserActivity(CreatedAt DESC);
CREATE INDEX IX_UserActivity_ActivityType ON UserActivity(ActivityType);
CREATE INDEX IX_UserActivity_EntityType ON UserActivity(EntityType, EntityId);
