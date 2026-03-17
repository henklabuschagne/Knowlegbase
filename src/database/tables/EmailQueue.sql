CREATE TABLE EmailQueue (
    EmailId INT PRIMARY KEY IDENTITY(1,1),
    ToEmail NVARCHAR(255) NOT NULL,
    ToName NVARCHAR(255) NULL,
    FromEmail NVARCHAR(255) NOT NULL,
    FromName NVARCHAR(255) NULL,
    Subject NVARCHAR(500) NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    IsHtml BIT NOT NULL DEFAULT 1,
    Priority INT NOT NULL DEFAULT 5, -- 1=High, 5=Normal, 10=Low
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Sent, Failed
    Attempts INT NOT NULL DEFAULT 0,
    MaxAttempts INT NOT NULL DEFAULT 3,
    ErrorMessage NVARCHAR(MAX) NULL,
    ScheduledFor DATETIME2 NULL,
    SentAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UserId INT NULL,
    EntityType NVARCHAR(50) NULL,
    EntityId INT NULL,
    CONSTRAINT FK_EmailQueue_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_EmailQueue_Status ON EmailQueue(Status);
CREATE INDEX IX_EmailQueue_ScheduledFor ON EmailQueue(ScheduledFor);
CREATE INDEX IX_EmailQueue_Priority ON EmailQueue(Priority);
CREATE INDEX IX_EmailQueue_UserId ON EmailQueue(UserId);
CREATE INDEX IX_EmailQueue_EntityType_EntityId ON EmailQueue(EntityType, EntityId);
