CREATE TABLE EmailPreferences (
    PreferenceId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    EmailType NVARCHAR(50) NOT NULL, -- ArticleApproval, Mention, Feedback, etc.
    IsEnabled BIT NOT NULL DEFAULT 1,
    Frequency NVARCHAR(20) NOT NULL DEFAULT 'Immediate', -- Immediate, Daily, Weekly
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_EmailPreferences_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT UQ_EmailPreferences_User_Type UNIQUE (UserId, EmailType)
);

CREATE INDEX IX_EmailPreferences_UserId ON EmailPreferences(UserId);
CREATE INDEX IX_EmailPreferences_EmailType ON EmailPreferences(EmailType);
