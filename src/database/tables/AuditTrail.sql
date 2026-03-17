CREATE TABLE AuditTrail (
    AuditId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL,
    TableName NVARCHAR(100) NOT NULL,
    RecordId INT NOT NULL,
    Operation NVARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    ColumnName NVARCHAR(100) NULL,
    OldValue NVARCHAR(MAX) NULL,
    NewValue NVARCHAR(MAX) NULL,
    ChangedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_AuditTrail_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_AuditTrail_UserId ON AuditTrail(UserId);
CREATE INDEX IX_AuditTrail_TableName ON AuditTrail(TableName);
CREATE INDEX IX_AuditTrail_RecordId ON AuditTrail(RecordId);
CREATE INDEX IX_AuditTrail_ChangedAt ON AuditTrail(ChangedAt DESC);
CREATE INDEX IX_AuditTrail_TableName_RecordId ON AuditTrail(TableName, RecordId);
