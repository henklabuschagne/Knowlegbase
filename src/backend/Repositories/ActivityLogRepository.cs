using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IActivityLogRepository
{
    Task<int> LogActivityAsync(CreateActivityLogDto log);
    Task<PagedActivityLogsDto> GetActivityLogsAsync(
        int? userId, string? entityType, int? entityId, string? action,
        DateTime? startDate, DateTime? endDate, int pageNumber, int pageSize);
    Task<PagedAuditTrailDto> GetAuditTrailAsync(
        string? tableName, int? recordId, int? userId,
        DateTime? startDate, DateTime? endDate, int pageNumber, int pageSize);
    Task<ActivityStatsResultDto> GetActivityStatsAsync(DateTime? startDate, DateTime? endDate);
}

public class ActivityLogRepository : IActivityLogRepository
{
    private readonly string _connectionString;

    public ActivityLogRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> LogActivityAsync(CreateActivityLogDto log)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            log.UserId,
            log.EntityType,
            log.EntityId,
            log.Action,
            log.Description,
            log.OldValue,
            log.NewValue,
            log.IpAddress,
            log.UserAgent
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_LogActivity",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.ActivityId ?? 0;
    }

    public async Task<PagedActivityLogsDto> GetActivityLogsAsync(
        int? userId, string? entityType, int? entityId, string? action,
        DateTime? startDate, DateTime? endDate, int pageNumber, int pageSize)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            EntityType = entityType,
            EntityId = entityId,
            Action = action,
            StartDate = startDate,
            EndDate = endDate,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetActivityLogs",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var totalCount = await multi.ReadFirstAsync<int>();
        var activities = (await multi.ReadAsync<ActivityLogDto>()).ToList();

        return new PagedActivityLogsDto
        {
            Activities = activities,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedAuditTrailDto> GetAuditTrailAsync(
        string? tableName, int? recordId, int? userId,
        DateTime? startDate, DateTime? endDate, int pageNumber, int pageSize)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TableName = tableName,
            RecordId = recordId,
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetAuditTrail",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var totalCount = await multi.ReadFirstAsync<int>();
        var auditRecords = (await multi.ReadAsync<AuditTrailDto>()).ToList();

        return new PagedAuditTrailDto
        {
            AuditRecords = auditRecords,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<ActivityStatsResultDto> GetActivityStatsAsync(DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetActivityStats",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var overallStats = await multi.ReadFirstOrDefaultAsync<ActivityStatsDto>();
        var entityTypeStats = (await multi.ReadAsync<EntityTypeStatsDto>()).ToList();
        var actionStats = (await multi.ReadAsync<ActionStatsDto>()).ToList();
        var topUsers = (await multi.ReadAsync<TopUserActivityDto>()).ToList();
        var timeline = (await multi.ReadAsync<ActivityTimelineDto>()).ToList();

        return new ActivityStatsResultDto
        {
            OverallStats = overallStats ?? new ActivityStatsDto(),
            EntityTypeStats = entityTypeStats,
            ActionStats = actionStats,
            TopUsers = topUsers,
            Timeline = timeline
        };
    }
}
