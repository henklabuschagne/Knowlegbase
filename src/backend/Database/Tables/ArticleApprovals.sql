-- Article Approvals Table (tracks approval workflow)
CREATE TABLE ArticleApprovals (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,
    ArticleId INT NOT NULL,
    ArticleVersionId INT NOT NULL,
    SubmittedByUserId INT NOT NULL,
    ApprovalLevel INT NOT NULL, -- 1=Support Review, 2=Admin Final Approval
    ApproverUserId INT NULL,
    Status NVARCHAR(50) NOT NULL, -- Pending, Approved, Rejected
    Comments NVARCHAR(2000) NULL,
    SubmittedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReviewedAt DATETIME2 NULL,
    CONSTRAINT FK_ArticleApprovals_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId),
    CONSTRAINT FK_ArticleApprovals_ArticleVersion FOREIGN KEY (ArticleVersionId) REFERENCES ArticleVersions(ArticleVersionId),
    CONSTRAINT FK_ArticleApprovals_SubmittedBy FOREIGN KEY (SubmittedByUserId) REFERENCES Users(UserId),
    CONSTRAINT FK_ArticleApprovals_Approver FOREIGN KEY (ApproverUserId) REFERENCES Users(UserId)
);

-- Indexes
CREATE INDEX IX_ArticleApprovals_Article ON ArticleApprovals(ArticleId);
CREATE INDEX IX_ArticleApprovals_Status ON ArticleApprovals(Status);
CREATE INDEX IX_ArticleApprovals_Approver ON ArticleApprovals(ApproverUserId);
CREATE INDEX IX_ArticleApprovals_SubmittedAt ON ArticleApprovals(SubmittedAt DESC);
