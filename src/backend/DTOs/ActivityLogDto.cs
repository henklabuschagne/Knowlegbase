namespace KnowledgeBase.DTOs;

public class ActivityLogDto
{
    public int ActivityId { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateActivityLogDto
{
    public int? UserId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}

public class AuditTrailDto
{
    public int AuditId { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string TableName { get; set; } = string.Empty;
    public int RecordId { get; set; }
    public string Operation { get; set; } = string.Empty;
    public string? ColumnName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateTime ChangedAt { get; set; }
}

public class ActivityStatsDto
{
    public int TotalActivities { get; set; }
    public int UniqueUsers { get; set; }
    public int EntityTypes { get; set; }
    public int ActionTypes { get; set; }
}

public class EntityTypeStatsDto
{
    public string EntityType { get; set; } = string.Empty;
    public int ActivityCount { get; set; }
    public int UniqueUsers { get; set; }
}

public class ActionStatsDto
{
    public string Action { get; set; } = string.Empty;
    public int ActivityCount { get; set; }
    public int UniqueUsers { get; set; }
}

public class TopUserActivityDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int ActivityCount { get; set; }
    public DateTime LastActivity { get; set; }
}

public class ActivityTimelineDto
{
    public DateTime ActivityDate { get; set; }
    public int ActivityCount { get; set; }
    public int UniqueUsers { get; set; }
}

public class ActivityStatsResultDto
{
    public ActivityStatsDto OverallStats { get; set; } = new();
    public List<EntityTypeStatsDto> EntityTypeStats { get; set; } = new();
    public List<ActionStatsDto> ActionStats { get; set; } = new();
    public List<TopUserActivityDto> TopUsers { get; set; } = new();
    public List<ActivityTimelineDto> Timeline { get; set; } = new();
}

public class PagedActivityLogsDto
{
    public List<ActivityLogDto> Activities { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class PagedAuditTrailDto
{
    public List<AuditTrailDto> AuditRecords { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
