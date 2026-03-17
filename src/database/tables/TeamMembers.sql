CREATE TABLE TeamMembers (
    TeamMemberId INT PRIMARY KEY IDENTITY(1,1),
    TeamId INT NOT NULL,
    UserId INT NOT NULL,
    TeamRole NVARCHAR(50) NOT NULL DEFAULT 'Member', -- Member, Lead, Manager
    JoinedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_TeamMembers_Team FOREIGN KEY (TeamId) REFERENCES Teams(TeamId) ON DELETE CASCADE,
    CONSTRAINT FK_TeamMembers_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT UQ_TeamMembers UNIQUE (TeamId, UserId)
);

CREATE INDEX IX_TeamMembers_TeamId ON TeamMembers(TeamId);
CREATE INDEX IX_TeamMembers_UserId ON TeamMembers(UserId);
CREATE INDEX IX_TeamMembers_TeamRole ON TeamMembers(TeamRole);
