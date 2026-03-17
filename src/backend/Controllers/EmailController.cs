using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KnowledgeBaseApp.DTOs;
using KnowledgeBaseApp.Repositories;
using KnowledgeBaseApp.Services;

namespace KnowledgeBaseApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IEmailRepository _emailRepository;
        private readonly ILogger<EmailController> _logger;

        public EmailController(
            IEmailService emailService,
            IEmailRepository emailRepository,
            ILogger<EmailController> logger)
        {
            _emailService = emailService;
            _emailRepository = emailRepository;
            _logger = logger;
        }

        /// <summary>
        /// Queue an email for sending
        /// </summary>
        [HttpPost("queue")]
        [Authorize(Roles = "Admin,Support")]
        public async Task<ActionResult<int>> QueueEmail([FromBody] QueueEmailDto emailDto)
        {
            try
            {
                var emailId = await _emailService.QueueEmailAsync(emailDto);
                return Ok(emailId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing email");
                return StatusCode(500, new { error = "Failed to queue email", details = ex.Message });
            }
        }

        /// <summary>
        /// Process pending emails (typically called by a background job)
        /// </summary>
        [HttpPost("process")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ProcessPendingEmails()
        {
            try
            {
                await _emailService.ProcessPendingEmailsAsync();
                return Ok(new { message = "Pending emails processed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing pending emails");
                return StatusCode(500, new { error = "Failed to process emails", details = ex.Message });
            }
        }

        /// <summary>
        /// Get email queue status
        /// </summary>
        [HttpGet("queue/status")]
        [Authorize(Roles = "Admin,Support")]
        public async Task<ActionResult> GetQueueStatus()
        {
            try
            {
                var pending = await _emailRepository.GetPendingEmailsAsync(100);
                var stats = new
                {
                    pendingCount = pending.Count,
                    highPriority = pending.Count(e => e.Priority == "High"),
                    normalPriority = pending.Count(e => e.Priority == "Normal"),
                    lowPriority = pending.Count(e => e.Priority == "Low")
                };
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting queue status");
                return StatusCode(500, new { error = "Failed to get queue status", details = ex.Message });
            }
        }

        /// <summary>
        /// Get user email preferences
        /// </summary>
        [HttpGet("preferences")]
        public async Task<ActionResult<EmailPreferenceDto>> GetEmailPreferences()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var preferences = await _emailRepository.GetUserEmailPreferencesAsync(userId);
                
                if (preferences == null)
                {
                    // Return default preferences
                    return Ok(new EmailPreferenceDto
                    {
                        UserId = userId,
                        ArticleApprovalNotifications = true,
                        ArticlePublishedNotifications = true,
                        FeedbackNotifications = true,
                        CommentNotifications = true,
                        NotificationFrequency = "Immediate"
                    });
                }

                return Ok(preferences);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting email preferences");
                return StatusCode(500, new { error = "Failed to get email preferences", details = ex.Message });
            }
        }

        /// <summary>
        /// Update user email preferences
        /// </summary>
        [HttpPut("preferences")]
        public async Task<ActionResult> UpdateEmailPreferences([FromBody] UpdateEmailPreferenceDto preferenceDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                preferenceDto.UserId = userId;

                await _emailRepository.UpsertEmailPreferenceAsync(preferenceDto);
                return Ok(new { message = "Email preferences updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email preferences");
                return StatusCode(500, new { error = "Failed to update email preferences", details = ex.Message });
            }
        }

        /// <summary>
        /// Get email templates (Admin only)
        /// </summary>
        [HttpGet("templates")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<EmailTemplateDto>>> GetEmailTemplates()
        {
            try
            {
                var templates = await _emailRepository.GetAllEmailTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting email templates");
                return StatusCode(500, new { error = "Failed to get email templates", details = ex.Message });
            }
        }

        /// <summary>
        /// Update email template (Admin only)
        /// </summary>
        [HttpPut("templates/{templateName}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateEmailTemplate(string templateName, [FromBody] UpdateEmailTemplateDto templateDto)
        {
            try
            {
                templateDto.TemplateName = templateName;
                await _emailRepository.UpdateEmailTemplateAsync(templateDto);
                return Ok(new { message = "Email template updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email template");
                return StatusCode(500, new { error = "Failed to update email template", details = ex.Message });
            }
        }

        /// <summary>
        /// Send test email
        /// </summary>
        [HttpPost("test")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> SendTestEmail([FromBody] SendTestEmailDto testEmailDto)
        {
            try
            {
                var emailDto = new QueueEmailDto
                {
                    RecipientEmail = testEmailDto.RecipientEmail,
                    RecipientName = testEmailDto.RecipientName,
                    Subject = "Test Email from Knowledge Base",
                    Body = "<h1>Test Email</h1><p>This is a test email from the Knowledge Base system.</p>",
                    Priority = "Normal",
                    ScheduledFor = DateTime.UtcNow
                };

                var emailId = await _emailService.QueueEmailAsync(emailDto);
                var success = await _emailService.SendEmailAsync(emailId);

                if (success)
                {
                    return Ok(new { message = "Test email sent successfully" });
                }
                else
                {
                    return StatusCode(500, new { error = "Failed to send test email" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test email");
                return StatusCode(500, new { error = "Failed to send test email", details = ex.Message });
            }
        }

        /// <summary>
        /// Get email history for current user
        /// </summary>
        [HttpGet("history")]
        public async Task<ActionResult<List<EmailDto>>> GetEmailHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userEmail = User.FindFirst("email")?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return BadRequest(new { error = "User email not found" });
                }

                var emails = await _emailRepository.GetEmailHistoryAsync(userEmail, page, pageSize);
                return Ok(emails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting email history");
                return StatusCode(500, new { error = "Failed to get email history", details = ex.Message });
            }
        }

        /// <summary>
        /// Retry failed email
        /// </summary>
        [HttpPost("{emailId}/retry")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RetryFailedEmail(int emailId)
        {
            try
            {
                var success = await _emailService.SendEmailAsync(emailId);
                
                if (success)
                {
                    return Ok(new { message = "Email retried successfully" });
                }
                else
                {
                    return StatusCode(500, new { error = "Failed to retry email" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrying email");
                return StatusCode(500, new { error = "Failed to retry email", details = ex.Message });
            }
        }
    }

    public class SendTestEmailDto
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
    }

    public class UpdateEmailTemplateDto
    {
        public string TemplateName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string TemplateContent { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
