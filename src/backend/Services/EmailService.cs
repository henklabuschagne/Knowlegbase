using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using KnowledgeBaseApp.DTOs;
using KnowledgeBaseApp.Repositories;

namespace KnowledgeBaseApp.Services
{
    public interface IEmailService
    {
        Task<int> QueueEmailAsync(QueueEmailDto emailDto);
        Task ProcessPendingEmailsAsync();
        Task<bool> SendEmailAsync(int emailId);
        Task<string> RenderEmailTemplateAsync(string templateName, Dictionary<string, string> variables);
        Task SendArticleApprovalEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName);
        Task SendArticlePublishedEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName);
        Task SendFeedbackReceivedEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName);
    }

    public class EmailService : IEmailService
    {
        private readonly IEmailRepository _emailRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IEmailRepository emailRepository,
            IConfiguration configuration,
            ILogger<EmailService> logger)
        {
            _emailRepository = emailRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<int> QueueEmailAsync(QueueEmailDto emailDto)
        {
            try
            {
                var emailId = await _emailRepository.QueueEmailAsync(emailDto);
                _logger.LogInformation($"Email queued successfully. EmailId: {emailId}");
                return emailId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queueing email");
                throw;
            }
        }

        public async Task ProcessPendingEmailsAsync()
        {
            try
            {
                var pendingEmails = await _emailRepository.GetPendingEmailsAsync(10);
                
                _logger.LogInformation($"Processing {pendingEmails.Count} pending emails");

                foreach (var email in pendingEmails)
                {
                    await SendEmailAsync(email.EmailId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing pending emails");
                throw;
            }
        }

        public async Task<bool> SendEmailAsync(int emailId)
        {
            try
            {
                var email = await _emailRepository.GetEmailByIdAsync(emailId);
                if (email == null)
                {
                    _logger.LogWarning($"Email not found: {emailId}");
                    return false;
                }

                // TODO: Implement actual email sending logic with SendGrid, AWS SES, or SMTP
                // For now, we'll simulate sending
                bool sendSuccess = await SimulateSendEmailAsync(email);

                if (sendSuccess)
                {
                    await _emailRepository.UpdateEmailStatusAsync(emailId, "Sent", null);
                    _logger.LogInformation($"Email sent successfully: {emailId}");
                    return true;
                }
                else
                {
                    await _emailRepository.UpdateEmailStatusAsync(emailId, "Failed", "Simulated send failure");
                    _logger.LogWarning($"Email send failed: {emailId}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email: {emailId}");
                await _emailRepository.UpdateEmailStatusAsync(emailId, "Failed", ex.Message);
                return false;
            }
        }

        public async Task<string> RenderEmailTemplateAsync(string templateName, Dictionary<string, string> variables)
        {
            try
            {
                var template = await _emailRepository.GetEmailTemplateAsync(templateName);
                if (template == null)
                {
                    _logger.LogWarning($"Email template not found: {templateName}");
                    return string.Empty;
                }

                string renderedContent = template.TemplateContent;

                // Replace variables in the format {{variableName}}
                foreach (var variable in variables)
                {
                    string placeholder = $"{{{{{variable.Key}}}}}";
                    renderedContent = renderedContent.Replace(placeholder, variable.Value);
                }

                return renderedContent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error rendering email template: {templateName}");
                throw;
            }
        }

        public async Task SendArticleApprovalEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName)
        {
            try
            {
                var variables = new Dictionary<string, string>
                {
                    { "recipientName", recipientName },
                    { "articleTitle", articleTitle },
                    { "articleId", articleId.ToString() },
                    { "approvalUrl", $"{_configuration["AppUrl"]}/articles/approve/{articleId}" }
                };

                var content = await RenderEmailTemplateAsync("ArticleApproval", variables);

                var emailDto = new QueueEmailDto
                {
                    RecipientEmail = recipientEmail,
                    RecipientName = recipientName,
                    Subject = $"Article Pending Approval: {articleTitle}",
                    Body = content,
                    Priority = "High",
                    ScheduledFor = DateTime.UtcNow
                };

                await QueueEmailAsync(emailDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending article approval email");
                throw;
            }
        }

        public async Task SendArticlePublishedEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName)
        {
            try
            {
                var variables = new Dictionary<string, string>
                {
                    { "recipientName", recipientName },
                    { "articleTitle", articleTitle },
                    { "articleId", articleId.ToString() },
                    { "articleUrl", $"{_configuration["AppUrl"]}/articles/{articleId}" }
                };

                var content = await RenderEmailTemplateAsync("ArticlePublished", variables);

                var emailDto = new QueueEmailDto
                {
                    RecipientEmail = recipientEmail,
                    RecipientName = recipientName,
                    Subject = $"Article Published: {articleTitle}",
                    Body = content,
                    Priority = "Normal",
                    ScheduledFor = DateTime.UtcNow
                };

                await QueueEmailAsync(emailDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending article published email");
                throw;
            }
        }

        public async Task SendFeedbackReceivedEmailAsync(int articleId, string articleTitle, string recipientEmail, string recipientName)
        {
            try
            {
                var variables = new Dictionary<string, string>
                {
                    { "recipientName", recipientName },
                    { "articleTitle", articleTitle },
                    { "articleId", articleId.ToString() },
                    { "feedbackUrl", $"{_configuration["AppUrl"]}/articles/{articleId}/feedback" }
                };

                var content = await RenderEmailTemplateAsync("FeedbackReceived", variables);

                var emailDto = new QueueEmailDto
                {
                    RecipientEmail = recipientEmail,
                    RecipientName = recipientName,
                    Subject = $"Feedback Received on: {articleTitle}",
                    Body = content,
                    Priority = "Normal",
                    ScheduledFor = DateTime.UtcNow
                };

                await QueueEmailAsync(emailDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending feedback received email");
                throw;
            }
        }

        // Simulate email sending - Replace with actual implementation
        private async Task<bool> SimulateSendEmailAsync(EmailDto email)
        {
            // In production, replace this with actual email provider integration:
            
            // SendGrid Example:
            // var client = new SendGridClient(_configuration["SendGrid:ApiKey"]);
            // var msg = new SendGridMessage()
            // {
            //     From = new EmailAddress(_configuration["SendGrid:FromEmail"], _configuration["SendGrid:FromName"]),
            //     Subject = email.Subject,
            //     HtmlContent = email.Body
            // };
            // msg.AddTo(new EmailAddress(email.RecipientEmail, email.RecipientName));
            // var response = await client.SendEmailAsync(msg);
            // return response.IsSuccessStatusCode;

            // AWS SES Example:
            // using var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.USEast1);
            // var sendRequest = new SendEmailRequest
            // {
            //     Source = _configuration["AWS:SES:FromEmail"],
            //     Destination = new Destination { ToAddresses = new List<string> { email.RecipientEmail } },
            //     Message = new Message
            //     {
            //         Subject = new Content(email.Subject),
            //         Body = new Body { Html = new Content { Charset = "UTF-8", Data = email.Body } }
            //     }
            // };
            // var response = await client.SendEmailAsync(sendRequest);
            // return response.HttpStatusCode == System.Net.HttpStatusCode.OK;

            // SMTP Example:
            // using var smtpClient = new SmtpClient(_configuration["SMTP:Host"])
            // {
            //     Port = int.Parse(_configuration["SMTP:Port"]),
            //     Credentials = new NetworkCredential(_configuration["SMTP:Username"], _configuration["SMTP:Password"]),
            //     EnableSsl = true,
            // };
            // var mailMessage = new MailMessage
            // {
            //     From = new MailAddress(_configuration["SMTP:FromEmail"], _configuration["SMTP:FromName"]),
            //     Subject = email.Subject,
            //     Body = email.Body,
            //     IsBodyHtml = true,
            // };
            // mailMessage.To.Add(new MailAddress(email.RecipientEmail, email.RecipientName));
            // await smtpClient.SendMailAsync(mailMessage);
            // return true;

            // Simulation
            await Task.Delay(100); // Simulate network delay
            _logger.LogInformation($"[SIMULATED] Email sent to: {email.RecipientEmail}, Subject: {email.Subject}");
            return true; // Simulate success (90% success rate for testing)
        }
    }
}
