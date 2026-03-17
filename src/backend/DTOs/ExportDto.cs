using System;
using System.Collections.Generic;

namespace KnowledgeBaseApp.DTOs
{
    // Export Request DTOs
    public class ExportRequestDto
    {
        public string Format { get; set; } = "JSON"; // JSON or CSV
        public string EntityType { get; set; } = "Articles"; // Articles, Users, Tags, All
        public bool IncludeRelated { get; set; } = true;
        public ExportFilterDto? Filters { get; set; }
    }

    public class ExportFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<int>? EntityIds { get; set; }
        public bool? IsActive { get; set; }
    }

    // Import Request DTOs
    public class ImportRequestDto
    {
        public string Format { get; set; } = "JSON"; // JSON or CSV
        public string EntityType { get; set; } = "Articles"; // Articles, Users, Tags
        public string Data { get; set; } = string.Empty;
        public bool OverwriteExisting { get; set; } = false;
        public bool ValidateOnly { get; set; } = false;
    }

    public class ImportResultDto
    {
        public int TotalRecords { get; set; }
        public int SuccessfulImports { get; set; }
        public int FailedImports { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public List<string> Warnings { get; set; } = new List<string>();
        public DateTime ImportedAt { get; set; }
        public string ImportedBy { get; set; } = string.Empty;
    }

    // Backup DTOs
    public class FullBackupDto
    {
        public BackupMetadataDto Metadata { get; set; } = new BackupMetadataDto();
        public List<object> Articles { get; set; } = new List<object>();
        public List<object> Users { get; set; } = new List<object>();
        public List<object> Tags { get; set; } = new List<object>();
        public List<object> ArticleTags { get; set; } = new List<object>();
        public List<object> ArticleVersions { get; set; } = new List<object>();
        public List<object> Feedback { get; set; } = new List<object>();
        public List<object> Comments { get; set; } = new List<object>();
        public List<object> ArticleRequests { get; set; } = new List<object>();
        public List<object> Attachments { get; set; } = new List<object>();
        public List<object> EmailTemplates { get; set; } = new List<object>();
        public List<object> ArticleTemplates { get; set; } = new List<object>();
        public List<object> Teams { get; set; } = new List<object>();
        public List<object> CustomRoles { get; set; } = new List<object>();
    }

    public class BackupMetadataDto
    {
        public string Version { get; set; } = "1.0";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        public string ApplicationVersion { get; set; } = "1.0.0";
        public int TotalArticles { get; set; }
        public int TotalUsers { get; set; }
        public int TotalTags { get; set; }
        public Dictionary<string, int> RecordCounts { get; set; } = new Dictionary<string, int>();
    }

    // Export Data DTOs (for CSV/JSON export)
    public class ArticleExportDto
    {
        public int ArticleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public bool IsInternal { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Version { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? PublishedBy { get; set; }
        public DateTime? PublishedAt { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
    }

    public class UserExportDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }

    public class TagExportDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public string TagType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // Import Data DTOs
    public class ArticleImportDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public bool IsInternal { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class UserImportDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public string? Password { get; set; }
    }

    public class TagImportDto
    {
        public string TagName { get; set; } = string.Empty;
        public string TagType { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    // Validation DTOs
    public class ValidationResultDto
    {
        public bool IsValid { get; set; }
        public List<ValidationErrorDto> Errors { get; set; } = new List<ValidationErrorDto>();
        public List<ValidationWarningDto> Warnings { get; set; } = new List<ValidationWarningDto>();
    }

    public class ValidationErrorDto
    {
        public int LineNumber { get; set; }
        public string Field { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }

    public class ValidationWarningDto
    {
        public int LineNumber { get; set; }
        public string Field { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
