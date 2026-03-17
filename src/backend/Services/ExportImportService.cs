using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using KnowledgeBaseApp.DTOs;
using KnowledgeBaseApp.Repositories;

namespace KnowledgeBaseApp.Services
{
    public interface IExportImportService
    {
        Task<byte[]> ExportDataAsync(ExportRequestDto request, int userId);
        Task<ImportResultDto> ImportDataAsync(ImportRequestDto request, int userId);
        Task<byte[]> CreateFullBackupAsync(int userId);
        Task<ImportResultDto> RestoreFromBackupAsync(string backupJson, int userId);
    }

    public class ExportImportService : IExportImportService
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITagRepository _tagRepository;
        private readonly ILogger<ExportImportService> _logger;

        public ExportImportService(
            IArticleRepository articleRepository,
            IUserRepository userRepository,
            ITagRepository tagRepository,
            ILogger<ExportImportService> logger)
        {
            _articleRepository = articleRepository;
            _userRepository = userRepository;
            _tagRepository = tagRepository;
            _logger = logger;
        }

        public async Task<byte[]> ExportDataAsync(ExportRequestDto request, int userId)
        {
            try
            {
                _logger.LogInformation($"Starting export: Format={request.Format}, EntityType={request.EntityType}");

                object exportData = request.EntityType switch
                {
                    "Articles" => await ExportArticlesAsync(request.Filters),
                    "Users" => await ExportUsersAsync(request.Filters),
                    "Tags" => await ExportTagsAsync(request.Filters),
                    "All" => await ExportAllDataAsync(request.Filters),
                    _ => throw new ArgumentException($"Invalid entity type: {request.EntityType}")
                };

                if (request.Format.ToUpper() == "JSON")
                {
                    return ExportToJson(exportData);
                }
                else if (request.Format.ToUpper() == "CSV")
                {
                    return ExportToCsv(exportData, request.EntityType);
                }
                else
                {
                    throw new ArgumentException($"Invalid export format: {request.Format}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting data");
                throw;
            }
        }

        public async Task<ImportResultDto> ImportDataAsync(ImportRequestDto request, int userId)
        {
            var result = new ImportResultDto
            {
                ImportedAt = DateTime.UtcNow,
                ImportedBy = userId.ToString()
            };

            try
            {
                _logger.LogInformation($"Starting import: Format={request.Format}, EntityType={request.EntityType}");

                if (request.Format.ToUpper() == "JSON")
                {
                    await ImportFromJsonAsync(request.Data, request.EntityType, request.OverwriteExisting, userId, result);
                }
                else if (request.Format.ToUpper() == "CSV")
                {
                    await ImportFromCsvAsync(request.Data, request.EntityType, request.OverwriteExisting, userId, result);
                }
                else
                {
                    result.Errors.Add($"Invalid import format: {request.Format}");
                    return result;
                }

                _logger.LogInformation($"Import completed: Success={result.SuccessfulImports}, Failed={result.FailedImports}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing data");
                result.Errors.Add($"Import failed: {ex.Message}");
                return result;
            }
        }

        public async Task<byte[]> CreateFullBackupAsync(int userId)
        {
            try
            {
                _logger.LogInformation("Creating full system backup");

                var backup = new FullBackupDto
                {
                    Metadata = new BackupMetadataDto
                    {
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = userId.ToString(),
                        ApplicationVersion = "1.0.0"
                    }
                };

                // Export all data
                var articles = await ExportArticlesAsync(null);
                var users = await ExportUsersAsync(null);
                var tags = await ExportTagsAsync(null);

                backup.Articles = articles.Cast<object>().ToList();
                backup.Users = users.Cast<object>().ToList();
                backup.Tags = tags.Cast<object>().ToList();

                backup.Metadata.TotalArticles = backup.Articles.Count;
                backup.Metadata.TotalUsers = backup.Users.Count;
                backup.Metadata.TotalTags = backup.Tags.Count;
                backup.Metadata.RecordCounts = new Dictionary<string, int>
                {
                    { "Articles", backup.Articles.Count },
                    { "Users", backup.Users.Count },
                    { "Tags", backup.Tags.Count }
                };

                var json = JsonSerializer.Serialize(backup, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                _logger.LogInformation($"Backup created: {backup.Metadata.TotalArticles} articles, {backup.Metadata.TotalUsers} users, {backup.Metadata.TotalTags} tags");

                return Encoding.UTF8.GetBytes(json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating backup");
                throw;
            }
        }

        public async Task<ImportResultDto> RestoreFromBackupAsync(string backupJson, int userId)
        {
            var result = new ImportResultDto
            {
                ImportedAt = DateTime.UtcNow,
                ImportedBy = userId.ToString()
            };

            try
            {
                _logger.LogInformation("Starting restore from backup");

                var backup = JsonSerializer.Deserialize<FullBackupDto>(backupJson);
                if (backup == null)
                {
                    result.Errors.Add("Invalid backup format");
                    return result;
                }

                _logger.LogInformation($"Restoring backup created at {backup.Metadata.CreatedAt}");

                // Restore tags first (dependencies)
                if (backup.Tags.Any())
                {
                    var tagsJson = JsonSerializer.Serialize(backup.Tags);
                    await ImportFromJsonAsync(tagsJson, "Tags", true, userId, result);
                }

                // Restore users
                if (backup.Users.Any())
                {
                    var usersJson = JsonSerializer.Serialize(backup.Users);
                    await ImportFromJsonAsync(usersJson, "Users", true, userId, result);
                }

                // Restore articles
                if (backup.Articles.Any())
                {
                    var articlesJson = JsonSerializer.Serialize(backup.Articles);
                    await ImportFromJsonAsync(articlesJson, "Articles", true, userId, result);
                }

                _logger.LogInformation($"Restore completed: Success={result.SuccessfulImports}, Failed={result.FailedImports}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error restoring backup");
                result.Errors.Add($"Restore failed: {ex.Message}");
                return result;
            }
        }

        // Private helper methods
        private async Task<List<ArticleExportDto>> ExportArticlesAsync(ExportFilterDto? filters)
        {
            // TODO: Implement filtering based on filters parameter
            var articles = await _articleRepository.GetAllArticlesAsync();
            
            return articles.Select(a => new ArticleExportDto
            {
                ArticleId = a.ArticleId,
                Title = a.Title,
                Content = a.Content,
                Summary = a.Summary,
                IsInternal = a.IsInternal,
                Status = a.Status,
                Version = a.Version,
                CreatedBy = a.CreatedByName ?? "Unknown",
                CreatedAt = a.CreatedAt,
                ModifiedBy = a.ModifiedByName,
                ModifiedAt = a.ModifiedAt,
                ViewCount = a.ViewCount,
                LikeCount = a.LikeCount,
                Tags = a.Tags?.Select(t => t.TagName).ToList() ?? new List<string>()
            }).ToList();
        }

        private async Task<List<UserExportDto>> ExportUsersAsync(ExportFilterDto? filters)
        {
            var users = await _userRepository.GetAllUsersAsync();
            
            return users.Select(u => new UserExportDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                FullName = u.FullName,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt
            }).ToList();
        }

        private async Task<List<TagExportDto>> ExportTagsAsync(ExportFilterDto? filters)
        {
            var tags = await _tagRepository.GetAllTagsAsync();
            
            return tags.Select(t => new TagExportDto
            {
                TagId = t.TagId,
                TagName = t.TagName,
                TagType = t.TagType,
                Description = t.Description,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt
            }).ToList();
        }

        private async Task<object> ExportAllDataAsync(ExportFilterDto? filters)
        {
            return new
            {
                Articles = await ExportArticlesAsync(filters),
                Users = await ExportUsersAsync(filters),
                Tags = await ExportTagsAsync(filters)
            };
        }

        private byte[] ExportToJson(object data)
        {
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            return Encoding.UTF8.GetBytes(json);
        }

        private byte[] ExportToCsv(object data, string entityType)
        {
            var csv = new StringBuilder();

            if (entityType == "Articles" && data is List<ArticleExportDto> articles)
            {
                csv.AppendLine("ArticleId,Title,Summary,IsInternal,Status,Version,CreatedBy,CreatedAt,ViewCount,LikeCount,Tags");
                foreach (var article in articles)
                {
                    csv.AppendLine($"{article.ArticleId},\"{EscapeCsv(article.Title)}\",\"{EscapeCsv(article.Summary)}\",{article.IsInternal},{article.Status},{article.Version},\"{EscapeCsv(article.CreatedBy)}\",{article.CreatedAt:yyyy-MM-dd},{article.ViewCount},{article.LikeCount},\"{string.Join(";", article.Tags)}\"");
                }
            }
            else if (entityType == "Users" && data is List<UserExportDto> users)
            {
                csv.AppendLine("UserId,Username,Email,FullName,Role,IsActive,CreatedAt,LastLoginAt");
                foreach (var user in users)
                {
                    csv.AppendLine($"{user.UserId},\"{EscapeCsv(user.Username)}\",\"{EscapeCsv(user.Email)}\",\"{EscapeCsv(user.FullName)}\",{user.Role},{user.IsActive},{user.CreatedAt:yyyy-MM-dd},{user.LastLoginAt:yyyy-MM-dd}");
                }
            }
            else if (entityType == "Tags" && data is List<TagExportDto> tags)
            {
                csv.AppendLine("TagId,TagName,TagType,Description,IsActive,CreatedAt");
                foreach (var tag in tags)
                {
                    csv.AppendLine($"{tag.TagId},\"{EscapeCsv(tag.TagName)}\",{tag.TagType},\"{EscapeCsv(tag.Description)}\",{tag.IsActive},{tag.CreatedAt:yyyy-MM-dd}");
                }
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }

        private async Task ImportFromJsonAsync(string jsonData, string entityType, bool overwrite, int userId, ImportResultDto result)
        {
            try
            {
                if (entityType == "Articles")
                {
                    var articles = JsonSerializer.Deserialize<List<ArticleImportDto>>(jsonData);
                    if (articles != null)
                    {
                        result.TotalRecords = articles.Count;
                        foreach (var article in articles)
                        {
                            try
                            {
                                var createDto = new CreateArticleDto
                                {
                                    Title = article.Title,
                                    Content = article.Content,
                                    Summary = article.Summary,
                                    IsInternal = article.IsInternal,
                                    TagIds = new List<int>() // TODO: Map tag names to IDs
                                };
                                await _articleRepository.CreateArticleAsync(createDto, userId);
                                result.SuccessfulImports++;
                            }
                            catch (Exception ex)
                            {
                                result.FailedImports++;
                                result.Errors.Add($"Failed to import article '{article.Title}': {ex.Message}");
                            }
                        }
                    }
                }
                else if (entityType == "Users")
                {
                    var users = JsonSerializer.Deserialize<List<UserImportDto>>(jsonData);
                    if (users != null)
                    {
                        result.TotalRecords = users.Count;
                        foreach (var user in users)
                        {
                            try
                            {
                                var createDto = new CreateUserDto
                                {
                                    Username = user.Username,
                                    Email = user.Email,
                                    Password = user.Password ?? "TempPassword123!",
                                    FullName = user.FullName,
                                    Role = user.Role
                                };
                                await _userRepository.CreateUserAsync(createDto);
                                result.SuccessfulImports++;
                                result.Warnings.Add($"User '{user.Username}' created with temporary password");
                            }
                            catch (Exception ex)
                            {
                                result.FailedImports++;
                                result.Errors.Add($"Failed to import user '{user.Username}': {ex.Message}");
                            }
                        }
                    }
                }
                else if (entityType == "Tags")
                {
                    var tags = JsonSerializer.Deserialize<List<TagImportDto>>(jsonData);
                    if (tags != null)
                    {
                        result.TotalRecords = tags.Count;
                        foreach (var tag in tags)
                        {
                            try
                            {
                                var createDto = new CreateTagDto
                                {
                                    TagName = tag.TagName,
                                    TagType = tag.TagType,
                                    Description = tag.Description
                                };
                                await _tagRepository.CreateTagAsync(createDto);
                                result.SuccessfulImports++;
                            }
                            catch (Exception ex)
                            {
                                result.FailedImports++;
                                result.Errors.Add($"Failed to import tag '{tag.TagName}': {ex.Message}");
                            }
                        }
                    }
                }
            }
            catch (JsonException ex)
            {
                result.Errors.Add($"Invalid JSON format: {ex.Message}");
            }
        }

        private async Task ImportFromCsvAsync(string csvData, string entityType, bool overwrite, int userId, ImportResultDto result)
        {
            try
            {
                var lines = csvData.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                if (lines.Length < 2)
                {
                    result.Errors.Add("CSV file is empty or invalid");
                    return;
                }

                result.TotalRecords = lines.Length - 1; // Exclude header

                // Skip header row
                for (int i = 1; i < lines.Length; i++)
                {
                    try
                    {
                        var fields = ParseCsvLine(lines[i]);
                        
                        if (entityType == "Articles" && fields.Length >= 3)
                        {
                            var createDto = new CreateArticleDto
                            {
                                Title = fields[0],
                                Content = fields.Length > 1 ? fields[1] : "",
                                Summary = fields.Length > 2 ? fields[2] : null,
                                IsInternal = fields.Length > 3 && bool.Parse(fields[3]),
                                TagIds = new List<int>()
                            };
                            await _articleRepository.CreateArticleAsync(createDto, userId);
                            result.SuccessfulImports++;
                        }
                        else if (entityType == "Users" && fields.Length >= 4)
                        {
                            var createDto = new CreateUserDto
                            {
                                Username = fields[0],
                                Email = fields[1],
                                FullName = fields[2],
                                Role = fields[3],
                                Password = "TempPassword123!"
                            };
                            await _userRepository.CreateUserAsync(createDto);
                            result.SuccessfulImports++;
                        }
                        else if (entityType == "Tags" && fields.Length >= 2)
                        {
                            var createDto = new CreateTagDto
                            {
                                TagName = fields[0],
                                TagType = fields[1],
                                Description = fields.Length > 2 ? fields[2] : null
                            };
                            await _tagRepository.CreateTagAsync(createDto);
                            result.SuccessfulImports++;
                        }
                    }
                    catch (Exception ex)
                    {
                        result.FailedImports++;
                        result.Errors.Add($"Failed to import line {i}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                result.Errors.Add($"CSV parsing error: {ex.Message}");
            }
        }

        private string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            return value.Replace("\"", "\"\"");
        }

        private string[] ParseCsvLine(string line)
        {
            var fields = new List<string>();
            var currentField = new StringBuilder();
            bool inQuotes = false;

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];

                if (c == '"')
                {
                    inQuotes = !inQuotes;
                }
                else if (c == ',' && !inQuotes)
                {
                    fields.Add(currentField.ToString().Trim());
                    currentField.Clear();
                }
                else
                {
                    currentField.Append(c);
                }
            }

            fields.Add(currentField.ToString().Trim());
            return fields.ToArray();
        }
    }
}
