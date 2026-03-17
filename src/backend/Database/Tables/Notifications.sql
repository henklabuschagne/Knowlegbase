-- Notifications Table
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(1000) NOT NULL,
    NotificationType NVARCHAR(50) NOT NULL, -- ArticleRequest, ArticleApproval, ArticlePublished, etc.
    RelatedEntityType NVARCHAR(50) NULL, -- Article, Request, etc.
    RelatedEntityId INT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReadAt DATETIME2 NULL,
    CONSTRAINT FK_Notifications_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Indexes
CREATE INDEX IX_Notifications_User ON Notifications(UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE INDEX IX_Notifications_CreatedAt ON Notifications(CreatedAt DESC);
CREATE INDEX IX_Notifications_Type ON Notifications(NotificationType);
