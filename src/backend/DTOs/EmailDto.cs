namespace KnowledgeBase.DTOs;

public class EmailQueueDto
{
    public int EmailId { get; set; }
    public string ToEmail { get; set; } = string.Empty;
    public string? ToName { get; set; }
    public string FromEmail { get; set; } = string.Empty;
    public string? FromName { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; } = true;
    public int Priority { get; set; } = 5;
    public string Status { get; set; } = "Pending";
    public int Attempts { get; set; }
    public int MaxAttempts { get; set; } = 3;
    public string? ErrorMessage { get; set; }
    public DateTime? ScheduledFor { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? UserId { get; set; }
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
}

public class CreateEmailDto
{
    public string ToEmail { get; set; } = string.Empty;
    public string? ToName { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; } = true;
    public int Priority { get; set; } = 5;
    public DateTime? ScheduledFor { get; set; }
    public int? UserId { get; set; }
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
}

public class EmailTemplateDto
{
    public int TemplateId { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string BodyHtml { get; set; } = string.Empty;
    public string? BodyText { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class EmailPreferenceDto
{
    public int PreferenceId { get; set; }
    public int UserId { get; set; }
    public string EmailType { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string Frequency { get; set; } = "Immediate";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpsertEmailPreferenceDto
{
    public string EmailType { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string Frequency { get; set; } = "Immediate";
}
