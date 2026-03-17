using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttachmentController : ControllerBase
{
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ILogger<AttachmentController> _logger;
    private readonly IWebHostEnvironment _environment;
    private const long MaxFileSize = 52428800; // 50MB
    private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
    private static readonly string[] AllowedDocumentExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".zip", ".rar" };

    public AttachmentController(
        IAttachmentRepository attachmentRepository,
        ILogger<AttachmentController> logger,
        IWebHostEnvironment environment)
    {
        _attachmentRepository = attachmentRepository;
        _logger = logger;
        _environment = environment;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(52428800)] // 50MB
    public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file, [FromForm] int articleId, [FromForm] string? description)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }

            if (file.Length > MaxFileSize)
            {
                return BadRequest(new { message = "File size exceeds 50MB limit" });
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var isImage = AllowedImageExtensions.Contains(fileExtension);
            var isDocument = AllowedDocumentExtensions.Contains(fileExtension);

            if (!isImage && !isDocument)
            {
                return BadRequest(new { message = "File type not allowed" });
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", articleId.ToString());
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create thumbnail for images
            string? thumbnailPath = null;
            if (isImage && fileExtension != ".svg")
            {
                // For now, we'll use the same image as thumbnail
                // In production, you'd want to generate actual thumbnails
                thumbnailPath = filePath;
            }

            var attachment = new AttachmentDto
            {
                ArticleId = articleId,
                FileName = uniqueFileName,
                OriginalFileName = file.FileName,
                FileSize = file.Length,
                FileType = file.ContentType,
                FilePath = filePath,
                FileExtension = fileExtension,
                UploadedBy = userId.Value,
                Description = description,
                IsImage = isImage,
                ThumbnailPath = thumbnailPath
            };

            var attachmentId = await _attachmentRepository.AddAttachmentAsync(attachment);
            attachment.AttachmentId = attachmentId;

            return Ok(new { attachment, message = "File uploaded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading attachment");
            return StatusCode(500, new { message = "An error occurred while uploading the file" });
        }
    }

    [HttpGet("article/{articleId}")]
    public async Task<ActionResult<List<AttachmentDto>>> GetArticleAttachments(int articleId, [FromQuery] bool includeDeleted = false)
    {
        try
        {
            var attachments = await _attachmentRepository.GetArticleAttachmentsAsync(articleId, includeDeleted);
            return Ok(attachments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article attachments");
            return StatusCode(500, new { message = "An error occurred while retrieving attachments" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AttachmentDto>> GetAttachment(int id)
    {
        try
        {
            var attachment = await _attachmentRepository.GetAttachmentByIdAsync(id);
            if (attachment == null)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            return Ok(attachment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attachment");
            return StatusCode(500, new { message = "An error occurred while retrieving the attachment" });
        }
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadAttachment(int id)
    {
        try
        {
            var attachment = await _attachmentRepository.GetAttachmentByIdAsync(id);
            if (attachment == null)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            if (attachment.IsDeleted)
            {
                return NotFound(new { message = "Attachment has been deleted" });
            }

            if (!System.IO.File.Exists(attachment.FilePath))
            {
                return NotFound(new { message = "File not found on server" });
            }

            // Record download
            var userId = GetUserId();
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();

            await _attachmentRepository.RecordDownloadAsync(id, userId, ipAddress, userAgent);

            // Return file
            var memory = new MemoryStream();
            using (var stream = new FileStream(attachment.FilePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, attachment.FileType, attachment.OriginalFileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading attachment");
            return StatusCode(500, new { message = "An error occurred while downloading the file" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAttachment(int id, [FromBody] UpdateAttachmentDto update)
    {
        try
        {
            var updated = await _attachmentRepository.UpdateAttachmentAsync(id, update);
            if (!updated)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            return Ok(new { message = "Attachment updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating attachment");
            return StatusCode(500, new { message = "An error occurred while updating the attachment" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttachment(int id)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var deleted = await _attachmentRepository.DeleteAttachmentAsync(id, userId.Value);
            if (!deleted)
            {
                return NotFound(new { message = "Attachment not found" });
            }

            return Ok(new { message = "Attachment deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attachment");
            return StatusCode(500, new { message = "An error occurred while deleting the attachment" });
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<AttachmentStatsResultDto>> GetAttachmentStats(
        [FromQuery] int? articleId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var stats = await _attachmentRepository.GetAttachmentStatsAsync(articleId, startDate, endDate);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attachment stats");
            return StatusCode(500, new { message = "An error occurred while retrieving stats" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
