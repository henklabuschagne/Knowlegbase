-- =============================================
-- Migration: Add ClientId to Articles Table
-- Date: 2026-02-05
-- Purpose: Support client-specific articles
-- =============================================

USE KnowledgeBase;
GO

PRINT 'Starting migration: Add ClientId to Articles';

-- Check if column already exists
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('Articles') 
    AND name = 'ClientId'
)
BEGIN
    PRINT 'Adding ClientId column...';
    
    -- Add column
    ALTER TABLE Articles
    ADD ClientId INT NULL;
    
    -- Add foreign key
    ALTER TABLE Articles
    ADD CONSTRAINT FK_Articles_Client 
    FOREIGN KEY (ClientId) REFERENCES Clients(ClientId);
    
    -- Add index for performance
    CREATE INDEX IX_Articles_ClientId ON Articles(ClientId);
    
    PRINT 'ClientId column added successfully';
END
ELSE
BEGIN
    PRINT 'ClientId column already exists, skipping...';
END
GO

-- Verify migration
PRINT 'Verifying migration...';
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Articles' 
AND COLUMN_NAME = 'ClientId';
GO

PRINT 'Migration completed successfully';
PRINT 'Note: All existing articles will have ClientId = NULL';
PRINT 'You can update them manually if needed.';
