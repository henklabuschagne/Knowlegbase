using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IEmailRepository
{
    Task<int> QueueEmailAsync(EmailQueueDto email, string fromEmail, string? fromName);
    Task<List<EmailQueueDto>> GetPendingEmailsAsync(int batchSize = 10);
    Task UpdateEmailStatusAsync(int emailId, string status, string? errorMessage = null);
    Task<EmailTemplateDto?> GetEmailTemplateAsync(string templateName);
    Task<List<EmailPreferenceDto>> GetUserEmailPreferencesAsync(int userId);
    Task<EmailPreferenceDto> UpsertEmailPreferenceAsync(int userId, UpsertEmailPreferenceDto preference);
    Task<EmailDto?> GetEmailByIdAsync(int emailId);
    Task<List<EmailTemplateDto>> GetAllEmailTemplatesAsync();
    Task UpdateEmailTemplateAsync(UpdateEmailTemplateDto templateDto);
    Task<List<EmailDto>> GetEmailHistoryAsync(string userEmail, int page, int pageSize);
}

public class EmailRepository : IEmailRepository
{
    private readonly string _connectionString;

    public EmailRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> QueueEmailAsync(EmailQueueDto email, string fromEmail, string? fromName)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            email.ToEmail,
            email.ToName,
            FromEmail = fromEmail,
            FromName = fromName,
            email.Subject,
            email.Body,
            email.IsHtml,
            email.Priority,
            email.ScheduledFor,
            email.UserId,
            email.EntityType,
            email.EntityId
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_QueueEmail",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.EmailId ?? 0;
    }

    public async Task<List<EmailQueueDto>> GetPendingEmailsAsync(int batchSize = 10)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { BatchSize = batchSize };

        var emails = await connection.QueryAsync<EmailQueueDto>(
            "sp_GetPendingEmails",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return emails.ToList();
    }

    public async Task UpdateEmailStatusAsync(int emailId, string status, string? errorMessage = null)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            EmailId = emailId,
            Status = status,
            ErrorMessage = errorMessage
        };

        await connection.ExecuteAsync(
            "sp_UpdateEmailStatus",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<EmailTemplateDto?> GetEmailTemplateAsync(string templateName)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { TemplateName = templateName };

        var template = await connection.QueryFirstOrDefaultAsync<EmailTemplateDto>(
            "sp_GetEmailTemplate",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return template;
    }

    public async Task<List<EmailPreferenceDto>> GetUserEmailPreferencesAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { UserId = userId };

        var preferences = await connection.QueryAsync<EmailPreferenceDto>(
            "sp_GetUserEmailPreferences",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return preferences.ToList();
    }

    public async Task<EmailPreferenceDto> UpsertEmailPreferenceAsync(int userId, UpsertEmailPreferenceDto preference)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            preference.EmailType,
            preference.IsEnabled,
            preference.Frequency
        };

        var result = await connection.QueryFirstAsync<EmailPreferenceDto>(
            "sp_UpsertEmailPreference",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result;
    }

    public async Task<EmailDto?> GetEmailByIdAsync(int emailId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { EmailId = emailId };

        var email = await connection.QueryFirstOrDefaultAsync<EmailDto>(
            "sp_GetEmailById",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return email;
    }

    public async Task<List<EmailTemplateDto>> GetAllEmailTemplatesAsync()
    {
        using var connection = new SqlConnection(_connectionString);

        var templates = await connection.QueryAsync<EmailTemplateDto>(
            "sp_GetAllEmailTemplates",
            commandType: CommandType.StoredProcedure
        );

        return templates.ToList();
    }

    public async Task UpdateEmailTemplateAsync(UpdateEmailTemplateDto templateDto)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TemplateName = templateDto.TemplateName,
            Subject = templateDto.Subject,
            Body = templateDto.Body,
            IsHtml = templateDto.IsHtml
        };

        await connection.ExecuteAsync(
            "sp_UpdateEmailTemplate",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<List<EmailDto>> GetEmailHistoryAsync(string userEmail, int page, int pageSize)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserEmail = userEmail,
            Page = page,
            PageSize = pageSize
        };

        var emails = await connection.QueryAsync<EmailDto>(
            "sp_GetEmailHistory",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return emails.ToList();
    }
}