CREATE TABLE TemplateFields (
    FieldId INT PRIMARY KEY IDENTITY(1,1),
    TemplateId INT NOT NULL,
    FieldName NVARCHAR(100) NOT NULL,
    FieldType NVARCHAR(50) NOT NULL, -- Text, RichText, Number, Date, Dropdown, Checkbox
    FieldLabel NVARCHAR(200) NOT NULL,
    Placeholder NVARCHAR(500) NULL,
    DefaultValue NVARCHAR(MAX) NULL,
    IsRequired BIT NOT NULL DEFAULT 0,
    DisplayOrder INT NOT NULL DEFAULT 0,
    ValidationRules NVARCHAR(MAX) NULL, -- JSON
    DropdownOptions NVARCHAR(MAX) NULL, -- JSON for dropdown type
    CONSTRAINT FK_TemplateFields_Template FOREIGN KEY (TemplateId) REFERENCES ArticleTemplates(TemplateId) ON DELETE CASCADE
);

CREATE INDEX IX_TemplateFields_TemplateId ON TemplateFields(TemplateId);
CREATE INDEX IX_TemplateFields_DisplayOrder ON TemplateFields(TemplateId, DisplayOrder);
