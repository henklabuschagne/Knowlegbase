-- Article Requests Table
CREATE TABLE ArticleRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    RequestedByUserId INT NOT NULL,
    AssignedToUserId INT NULL,
    StatusId INT NOT NULL DEFAULT 1, -- 1=Open, 2=UnderReview, 3=Approved, 4=Rejected, 5=Completed
    Priority INT NOT NULL DEFAULT 2, -- 1=Low, 2=Medium, 3=High, 4=Critical
    ArticleId INT NULL, -- Link to created article if completed
    RejectionReason NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    CONSTRAINT FK_ArticleRequests_RequestedBy FOREIGN KEY (RequestedByUserId) REFERENCES Users(UserId),
    CONSTRAINT FK_ArticleRequests_AssignedTo FOREIGN KEY (AssignedToUserId) REFERENCES Users(UserId),
    CONSTRAINT FK_ArticleRequests_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId)
);

-- Request Status Lookup
CREATE TABLE RequestStatuses (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500) NULL
);

-- Seed Request Statuses
INSERT INTO RequestStatuses (StatusName, Description) VALUES
('Open', 'Request submitted and awaiting review'),
('Under Review', 'Request is being evaluated by support/admin'),
('Approved', 'Request approved and assigned for article creation'),
('Rejected', 'Request rejected'),
('Completed', 'Article created and published');

-- Add foreign key constraint
ALTER TABLE ArticleRequests 
ADD CONSTRAINT FK_ArticleRequests_Status FOREIGN KEY (StatusId) REFERENCES RequestStatuses(StatusId);

-- Indexes
CREATE INDEX IX_ArticleRequests_RequestedBy ON ArticleRequests(RequestedByUserId);
CREATE INDEX IX_ArticleRequests_AssignedTo ON ArticleRequests(AssignedToUserId);
CREATE INDEX IX_ArticleRequests_Status ON ArticleRequests(StatusId);
CREATE INDEX IX_ArticleRequests_CreatedAt ON ArticleRequests(CreatedAt DESC);
