CREATE OR ALTER PROCEDURE sp_AddTemplateField
    @TemplateId INT,
    @FieldName NVARCHAR(100),
    @FieldType NVARCHAR(50),
    @FieldLabel NVARCHAR(200),
    @Placeholder NVARCHAR(500) = NULL,
    @DefaultValue NVARCHAR(MAX) = NULL,
    @IsRequired BIT = 0,
    @DisplayOrder INT = 0,
    @ValidationRules NVARCHAR(MAX) = NULL,
    @DropdownOptions NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO TemplateFields (
        TemplateId,
        FieldName,
        FieldType,
        FieldLabel,
        Placeholder,
        DefaultValue,
        IsRequired,
        DisplayOrder,
        ValidationRules,
        DropdownOptions
    )
    VALUES (
        @TemplateId,
        @FieldName,
        @FieldType,
        @FieldLabel,
        @Placeholder,
        @DefaultValue,
        @IsRequired,
        @DisplayOrder,
        @ValidationRules,
        @DropdownOptions
    );
    
    SELECT SCOPE_IDENTITY() AS FieldId;
END
