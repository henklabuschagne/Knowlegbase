CREATE TABLE UserCustomRoles (
    UserRoleId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    AssignedBy INT NOT NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2 NULL,
    CONSTRAINT FK_UserCustomRoles_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_UserCustomRoles_Role FOREIGN KEY (RoleId) REFERENCES CustomRoles(RoleId) ON DELETE CASCADE,
    CONSTRAINT FK_UserCustomRoles_AssignedBy FOREIGN KEY (AssignedBy) REFERENCES Users(UserId),
    CONSTRAINT UQ_UserCustomRoles UNIQUE (UserId, RoleId)
);

CREATE INDEX IX_UserCustomRoles_UserId ON UserCustomRoles(UserId);
CREATE INDEX IX_UserCustomRoles_RoleId ON UserCustomRoles(RoleId);
CREATE INDEX IX_UserCustomRoles_ExpiresAt ON UserCustomRoles(ExpiresAt);
