CREATE TABLE CustomRoles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_CustomRoles_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

CREATE INDEX IX_CustomRoles_IsActive ON CustomRoles(IsActive);
CREATE INDEX IX_CustomRoles_RoleName ON CustomRoles(RoleName);
