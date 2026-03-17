using KnowledgeBase.API.Models;

namespace KnowledgeBase.API.Repositories;

public interface ITagRepository
{
    Task<IEnumerable<TagType>> GetAllTagTypesAsync();
    Task<IEnumerable<Tag>> GetAllTagsAsync(int? tagTypeId = null);
    Task<Tag?> GetTagByIdAsync(int tagId);
    Task<int> CreateTagAsync(int tagTypeId, string tagName, string tagValue, string? description, string? colorCode);
    Task UpdateTagAsync(int tagId, string tagName, string tagValue, string? description, string? colorCode);
    Task DeleteTagAsync(int tagId);
}
