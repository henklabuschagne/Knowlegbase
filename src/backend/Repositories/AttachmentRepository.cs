using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IAttachmentRepository
{
    Task<int> AddAttachmentAsync(AttachmentDto attachment);
    Task<List<AttachmentDto>> GetArticleAttachmentsAsync(int articleId, bool includeDeleted = false);
    Task<AttachmentDto?> GetAttachmentByIdAsync(int attachmentId);
    Task<bool> UpdateAttachmentAsync(int attachmentId, UpdateAttachmentDto update);
    Task<bool> DeleteAttachmentAsync(int attachmentId, int deletedBy);
    Task RecordDownloadAsync(int attachmentId, int? userId, string? ipAddress, string? userAgent);
    Task<AttachmentStatsResultDto> GetAttachmentStatsAsync(int? articleId, DateTime? startDate, DateTime? endDate);
}

public class AttachmentRepository : IAttachmentRepository
{
    private readonly string _connectionString;

    public AttachmentRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> AddAttachmentAsync(AttachmentDto attachment)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            attachment.ArticleId,
            attachment.FileName,
            attachment.OriginalFileName,
            attachment.FileSize,
            attachment.FileType,
            attachment.FilePath,
            attachment.FileExtension,
            attachment.UploadedBy,
            attachment.Description,
            attachment.IsImage,
            attachment.ThumbnailPath
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_AddAttachment",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.AttachmentId ?? 0;
    }

    public async Task<List<AttachmentDto>> GetArticleAttachmentsAsync(int articleId, bool includeDeleted = false)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            IncludeDeleted = includeDeleted
        };

        var attachments = await connection.QueryAsync<AttachmentDto>(
            "sp_GetArticleAttachments",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return attachments.ToList();
    }

    public async Task<AttachmentDto?> GetAttachmentByIdAsync(int attachmentId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { AttachmentId = attachmentId };

        var attachment = await connection.QueryFirstOrDefaultAsync<AttachmentDto>(
            "sp_GetAttachmentById",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return attachment;
    }

    public async Task<bool> UpdateAttachmentAsync(int attachmentId, UpdateAttachmentDto update)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            AttachmentId = attachmentId,
            update.Description
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_UpdateAttachment",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.UpdatedCount > 0;
    }

    public async Task<bool> DeleteAttachmentAsync(int attachmentId, int deletedBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            AttachmentId = attachmentId,
            DeletedBy = deletedBy
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_DeleteAttachment",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.DeletedCount > 0;
    }

    public async Task RecordDownloadAsync(int attachmentId, int? userId, string? ipAddress, string? userAgent)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            AttachmentId = attachmentId,
            UserId = userId,
            IpAddress = ipAddress,
            UserAgent = userAgent
        };

        await connection.ExecuteAsync(
            "sp_RecordAttachmentDownload",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<AttachmentStatsResultDto> GetAttachmentStatsAsync(int? articleId, DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetAttachmentStats",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var overallStats = await multi.ReadFirstOrDefaultAsync<AttachmentStatsDto>();
        var fileTypeStats = (await multi.ReadAsync<FileTypeStatsDto>()).ToList();
        var topAttachments = (await multi.ReadAsync<TopAttachmentDto>()).ToList();
        var recentDownloads = (await multi.ReadAsync<RecentDownloadDto>()).ToList();

        return new AttachmentStatsResultDto
        {
            OverallStats = overallStats ?? new AttachmentStatsDto(),
            FileTypeStats = fileTypeStats,
            TopAttachments = topAttachments,
            RecentDownloads = recentDownloads
        };
    }
}
