using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KnowledgeBaseApp.DTOs;
using KnowledgeBaseApp.Services;
using System.Text;

namespace KnowledgeBaseApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExportImportController : ControllerBase
    {
        private readonly IExportImportService _exportImportService;
        private readonly ILogger<ExportImportController> _logger;

        public ExportImportController(
            IExportImportService exportImportService,
            ILogger<ExportImportController> logger)
        {
            _exportImportService = exportImportService;
            _logger = logger;
        }

        /// <summary>
        /// Export data in JSON or CSV format
        /// </summary>
        [HttpPost("export")]
        [Authorize(Roles = "Admin,Support")]
        public async Task<IActionResult> ExportData([FromBody] ExportRequestDto request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var data = await _exportImportService.ExportDataAsync(request, userId);

                var contentType = request.Format.ToUpper() == "JSON" 
                    ? "application/json" 
                    : "text/csv";

                var fileExtension = request.Format.ToLower();
                var fileName = $"export_{request.EntityType}_{DateTime.UtcNow:yyyyMMddHHmmss}.{fileExtension}";

                return File(data, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting data");
                return StatusCode(500, new { error = "Failed to export data", details = ex.Message });
            }
        }

        /// <summary>
        /// Import data from JSON or CSV
        /// </summary>
        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ImportResultDto>> ImportData([FromBody] ImportRequestDto request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var result = await _exportImportService.ImportDataAsync(request, userId);
                
                if (result.FailedImports > 0)
                {
                    return StatusCode(207, result); // 207 Multi-Status for partial success
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing data");
                return StatusCode(500, new { error = "Failed to import data", details = ex.Message });
            }
        }

        /// <summary>
        /// Create a complete backup of all system data
        /// </summary>
        [HttpPost("backup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFullBackup()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var backupData = await _exportImportService.CreateFullBackupAsync(userId);

                var fileName = $"full_backup_{DateTime.UtcNow:yyyyMMddHHmmss}.json";

                return File(backupData, "application/json", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating backup");
                return StatusCode(500, new { error = "Failed to create backup", details = ex.Message });
            }
        }

        /// <summary>
        /// Restore system from a backup file
        /// </summary>
        [HttpPost("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ImportResultDto>> RestoreFromBackup([FromBody] string backupJson)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var result = await _exportImportService.RestoreFromBackupAsync(backupJson, userId);

                if (result.FailedImports > 0)
                {
                    return StatusCode(207, result); // 207 Multi-Status for partial success
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error restoring backup");
                return StatusCode(500, new { error = "Failed to restore backup", details = ex.Message });
            }
        }

        /// <summary>
        /// Validate import data without actually importing
        /// </summary>
        [HttpPost("validate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ValidationResultDto>> ValidateImportData([FromBody] ImportRequestDto request)
        {
            try
            {
                request.ValidateOnly = true;
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                
                // Perform validation logic here
                var validationResult = new ValidationResultDto
                {
                    IsValid = true,
                    Errors = new List<ValidationErrorDto>(),
                    Warnings = new List<ValidationWarningDto>()
                };

                // TODO: Implement actual validation logic
                // This would parse the data and check for:
                // - Required fields
                // - Data type validation
                // - Duplicate checks
                // - Foreign key constraints
                // - Business rule violations

                return Ok(validationResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating import data");
                return StatusCode(500, new { error = "Failed to validate data", details = ex.Message });
            }
        }

        /// <summary>
        /// Get export/import history
        /// </summary>
        [HttpGet("history")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetExportImportHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                // TODO: Implement export/import history tracking
                // This would track all export and import operations with:
                // - Timestamp
                // - User who performed the operation
                // - Entity type
                // - Format
                // - Success/failure status
                // - Number of records

                var history = new List<object>
                {
                    new
                    {
                        id = 1,
                        operation = "Export",
                        entityType = "Articles",
                        format = "JSON",
                        recordCount = 156,
                        performedBy = "admin",
                        performedAt = DateTime.UtcNow.AddHours(-2),
                        status = "Success"
                    },
                    new
                    {
                        id = 2,
                        operation = "Import",
                        entityType = "Tags",
                        format = "CSV",
                        recordCount = 45,
                        performedBy = "admin",
                        performedAt = DateTime.UtcNow.AddDays(-1),
                        status = "Success"
                    }
                };

                return Ok(new
                {
                    data = history,
                    page,
                    pageSize,
                    totalRecords = history.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting export/import history");
                return StatusCode(500, new { error = "Failed to get history", details = ex.Message });
            }
        }

        /// <summary>
        /// Download export template (CSV headers)
        /// </summary>
        [HttpGet("template/{entityType}")]
        [Authorize(Roles = "Admin,Support")]
        public IActionResult DownloadTemplate(string entityType)
        {
            try
            {
                var template = entityType.ToLower() switch
                {
                    "articles" => "Title,Content,Summary,IsInternal,Tags\n\"Sample Article\",\"Article content here\",\"Brief summary\",false,\"Tag1;Tag2\"",
                    "users" => "Username,Email,FullName,Role\n\"johndoe\",\"john@example.com\",\"John Doe\",\"User\"",
                    "tags" => "TagName,TagType,Description\n\"Sample Tag\",\"Category\",\"Tag description\"",
                    _ => throw new ArgumentException($"Invalid entity type: {entityType}")
                };

                var bytes = Encoding.UTF8.GetBytes(template);
                var fileName = $"{entityType}_import_template.csv";

                return File(bytes, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading template");
                return StatusCode(500, new { error = "Failed to download template", details = ex.Message });
            }
        }

        /// <summary>
        /// Get export statistics
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetExportStats()
        {
            try
            {
                // TODO: Implement statistics from actual data
                var stats = new
                {
                    totalArticles = 567,
                    totalUsers = 234,
                    totalTags = 89,
                    lastExportDate = DateTime.UtcNow.AddDays(-2),
                    lastBackupDate = DateTime.UtcNow.AddDays(-7),
                    averageExportSize = "2.5 MB",
                    exportCount = new
                    {
                        today = 3,
                        thisWeek = 12,
                        thisMonth = 45
                    }
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting export stats");
                return StatusCode(500, new { error = "Failed to get stats", details = ex.Message });
            }
        }
    }
}
