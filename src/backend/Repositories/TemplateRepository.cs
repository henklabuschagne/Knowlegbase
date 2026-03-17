using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface ITemplateRepository
{
    Task<int> CreateTemplateAsync(CreateArticleTemplateDto template, int createdBy);
    Task<List<ArticleTemplateDto>> GetTemplatesAsync(string? category = null, bool? isActive = true);
    Task<ArticleTemplateDto?> GetTemplateByIdAsync(int templateId);
    Task<bool> UpdateTemplateAsync(int templateId, UpdateArticleTemplateDto template);
    Task<bool> DeleteTemplateAsync(int templateId);
    Task<bool> IncrementTemplateUsageAsync(int templateId);
    Task<int> AddTemplateFieldAsync(int templateId, CreateTemplateFieldDto field);
}

public class TemplateRepository : ITemplateRepository
{
    private readonly string _connectionString;

    public TemplateRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> CreateTemplateAsync(CreateArticleTemplateDto template, int createdBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            template.TemplateName,
            template.Description,
            template.Category,
            template.TitleTemplate,
            template.ContentTemplate,
            template.SummaryTemplate,
            template.IsInternal,
            CreatedBy = createdBy
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_CreateArticleTemplate",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var templateId = result?.TemplateId ?? 0;

        // Add fields
        if (template.Fields != null && template.Fields.Any())
        {
            foreach (var field in template.Fields)
            {
                await AddTemplateFieldAsync(templateId, field);
            }
        }

        // Add tags
        if (template.TagIds != null && template.TagIds.Any())
        {
            foreach (var tagId in template.TagIds)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO TemplateTags (TemplateId, TagId) VALUES (@TemplateId, @TagId)",
                    new { TemplateId = templateId, TagId = tagId }
                );
            }
        }

        return templateId;
    }

    public async Task<List<ArticleTemplateDto>> GetTemplatesAsync(string? category = null, bool? isActive = true)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            Category = category,
            IsActive = isActive
        };

        var templates = await connection.QueryAsync<ArticleTemplateDto>(
            "sp_GetArticleTemplates",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return templates.ToList();
    }

    public async Task<ArticleTemplateDto?> GetTemplateByIdAsync(int templateId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { TemplateId = templateId };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetArticleTemplateById",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var template = await multi.ReadFirstOrDefaultAsync<ArticleTemplateDto>();
        if (template == null) return null;

        template.Fields = (await multi.ReadAsync<TemplateFieldDto>()).ToList();
        template.Tags = (await multi.ReadAsync<TagDto>()).ToList();

        return template;
    }

    public async Task<bool> UpdateTemplateAsync(int templateId, UpdateArticleTemplateDto template)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TemplateId = templateId,
            template.TemplateName,
            template.Description,
            template.Category,
            template.TitleTemplate,
            template.ContentTemplate,
            template.SummaryTemplate,
            template.IsInternal,
            template.IsActive
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_UpdateArticleTemplate",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.UpdatedCount > 0;
    }

    public async Task<bool> DeleteTemplateAsync(int templateId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { TemplateId = templateId };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_DeleteArticleTemplate",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.DeletedCount > 0;
    }

    public async Task<bool> IncrementTemplateUsageAsync(int templateId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { TemplateId = templateId };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_IncrementTemplateUsage",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.UpdatedCount > 0;
    }

    public async Task<int> AddTemplateFieldAsync(int templateId, CreateTemplateFieldDto field)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TemplateId = templateId,
            field.FieldName,
            field.FieldType,
            field.FieldLabel,
            field.Placeholder,
            field.DefaultValue,
            field.IsRequired,
            field.DisplayOrder,
            field.ValidationRules,
            field.DropdownOptions
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_AddTemplateField",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.FieldId ?? 0;
    }
}
