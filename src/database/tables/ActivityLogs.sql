CREATE TABLE ActivityLogs (
    ActivityId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL, -- Nullable for system actions
    EntityType NVARCHAR(50) NOT NULL, -- Article, User, Tag, Request, etc.
    EntityId INT NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- Created, Updated, Deleted, Published, Approved, etc.
    Description NVARCHAR(MAX) NULL,
    OldValue NVARCHAR(MAX) NULL, -- JSON of previous state
    NewValue NVARCHAR(MAX) NULL, -- JSON of new state
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ActivityLogs_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_ActivityLogs_UserId ON ActivityLogs(UserId);
CREATE INDEX IX_ActivityLogs_EntityType ON ActivityLogs(EntityType);
CREATE INDEX IX_ActivityLogs_EntityId ON ActivityLogs(EntityId);
CREATE INDEX IX_ActivityLogs_Action ON ActivityLogs(Action);
CREATE INDEX IX_ActivityLogs_CreatedAt ON ActivityLogs(CreatedAt DESC);
CREATE INDEX IX_ActivityLogs_EntityType_EntityId ON ActivityLogs(EntityType, EntityId);
