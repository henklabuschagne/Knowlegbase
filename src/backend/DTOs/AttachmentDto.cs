namespace KnowledgeBase.DTOs;

public class AttachmentDto
{
    public int AttachmentId { get; set; }
    public int ArticleId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FileType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileExtension { get; set; } = string.Empty;
    public int UploadedBy { get; set; }
    public string? UploadedByName { get; set; }
    public DateTime UploadedAt { get; set; }
    public string? Description { get; set; }
    public bool IsImage { get; set; }
    public string? ThumbnailPath { get; set; }
    public int DownloadCount { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
    public string? DeletedByName { get; set; }
}

public class CreateAttachmentDto
{
    public int ArticleId { get; set; }
    public string? Description { get; set; }
}

public class UpdateAttachmentDto
{
    public string? Description { get; set; }
}

public class AttachmentStatsDto
{
    public int TotalAttachments { get; set; }
    public long TotalStorageBytes { get; set; }
    public int TotalDownloads { get; set; }
    public int TotalImages { get; set; }
    public int TotalDocuments { get; set; }
}

public class FileTypeStatsDto
{
    public string FileExtension { get; set; } = string.Empty;
    public int FileCount { get; set; }
    public int TotalDownloads { get; set; }
    public long TotalSize { get; set; }
}

public class TopAttachmentDto
{
    public int AttachmentId { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public int DownloadCount { get; set; }
    public DateTime UploadedAt { get; set; }
    public string ArticleTitle { get; set; } = string.Empty;
}

public class RecentDownloadDto
{
    public int DownloadId { get; set; }
    public int AttachmentId { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime DownloadedAt { get; set; }
    public string ArticleTitle { get; set; } = string.Empty;
}

public class AttachmentStatsResultDto
{
    public AttachmentStatsDto OverallStats { get; set; } = new();
    public List<FileTypeStatsDto> FileTypeStats { get; set; } = new();
    public List<TopAttachmentDto> TopAttachments { get; set; } = new();
    public List<RecentDownloadDto> RecentDownloads { get; set; } = new();
}
