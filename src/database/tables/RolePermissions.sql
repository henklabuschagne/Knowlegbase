CREATE TABLE RolePermissions (
    PermissionId INT PRIMARY KEY IDENTITY(1,1),
    RoleId INT NOT NULL,
    Resource NVARCHAR(100) NOT NULL, -- Articles, Users, Tags, etc.
    Action NVARCHAR(50) NOT NULL, -- Create, Read, Update, Delete, Approve, etc.
    Scope NVARCHAR(50) NOT NULL DEFAULT 'All', -- All, Own, Team, None
    Conditions NVARCHAR(MAX) NULL, -- JSON for additional conditions
    CONSTRAINT FK_RolePermissions_Role FOREIGN KEY (RoleId) REFERENCES CustomRoles(RoleId) ON DELETE CASCADE,
    CONSTRAINT UQ_RolePermissions UNIQUE (RoleId, Resource, Action)
);

CREATE INDEX IX_RolePermissions_RoleId ON RolePermissions(RoleId);
CREATE INDEX IX_RolePermissions_Resource ON RolePermissions(Resource);
CREATE INDEX IX_RolePermissions_Action ON RolePermissions(Action);
