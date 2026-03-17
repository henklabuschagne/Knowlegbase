CREATE TABLE TemplateTags (
    TemplateTagId INT PRIMARY KEY IDENTITY(1,1),
    TemplateId INT NOT NULL,
    TagId INT NOT NULL,
    CONSTRAINT FK_TemplateTags_Template FOREIGN KEY (TemplateId) REFERENCES ArticleTemplates(TemplateId) ON DELETE CASCADE,
    CONSTRAINT FK_TemplateTags_Tag FOREIGN KEY (TagId) REFERENCES Tags(TagId),
    CONSTRAINT UQ_TemplateTags UNIQUE (TemplateId, TagId)
);

CREATE INDEX IX_TemplateTags_TemplateId ON TemplateTags(TemplateId);
CREATE INDEX IX_TemplateTags_TagId ON TemplateTags(TagId);
