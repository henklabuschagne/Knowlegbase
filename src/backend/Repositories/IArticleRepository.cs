using KnowledgeBase.API.Models;

namespace KnowledgeBase.API.Repositories;

public interface IArticleRepository
{
    Task<(IEnumerable<Article> Articles, int TotalCount)> GetAllArticlesAsync(
        int? userId = null,
        bool? isInternal = null,
        int? statusId = null,
        bool? isPublished = null,
        string? searchTerm = null,
        int pageNumber = 1,
        int pageSize = 20
    );
    
    Task<Article?> GetArticleByIdAsync(int articleId);
    Task<IEnumerable<Tag>> GetArticleTagsAsync(int articleId);
    Task<Article> CreateArticleAsync(string title, string? summary, string? content, int createdBy, int statusId, bool isInternal, List<int>? tagIds);
    Task<Article> UpdateArticleAsync(int articleId, string title, string? summary, string? content, int updatedBy, int? statusId, bool? isInternal, List<int>? tagIds);
    Task DeleteArticleAsync(int articleId, int updatedBy);
    Task PublishArticleAsync(int articleId, int approvedBy);
    Task IncrementViewCountAsync(int articleId);
    Task<(IEnumerable<Article> Articles, int TotalCount)> SearchArticlesByTagsAsync(List<int> tagIds, bool? isPublished = true, bool? isInternal = null, int pageNumber = 1, int pageSize = 20);
    Task<IEnumerable<ArticleStatus>> GetAllArticleStatusesAsync();
}
