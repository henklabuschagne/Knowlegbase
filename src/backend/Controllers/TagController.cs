using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.API.DTOs.Tag;
using KnowledgeBase.API.Repositories;

namespace KnowledgeBase.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly ITagRepository _tagRepository;
    private readonly ILogger<TagController> _logger;

    public TagController(ITagRepository tagRepository, ILogger<TagController> logger)
    {
        _tagRepository = tagRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all tag types
    /// </summary>
    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<TagTypeDto>>> GetAllTagTypes()
    {
        try
        {
            var tagTypes = await _tagRepository.GetAllTagTypesAsync();
            var tagTypeDtos = tagTypes.Select(tt => new TagTypeDto
            {
                TagTypeId = tt.TagTypeId,
                TagTypeName = tt.TagTypeName,
                Description = tt.Description,
                IsActive = tt.IsActive,
                CreatedAt = tt.CreatedAt,
                UpdatedAt = tt.UpdatedAt
            });

            return Ok(tagTypeDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tag types");
            return StatusCode(500, new { message = "An error occurred while retrieving tag types" });
        }
    }

    /// <summary>
    /// Get all tags, optionally filtered by tag type
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagDto>>> GetAllTags([FromQuery] int? tagTypeId = null)
    {
        try
        {
            var tags = await _tagRepository.GetAllTagsAsync(tagTypeId);
            var tagDtos = tags.Select(t => new TagDto
            {
                TagId = t.TagId,
                TagTypeId = t.TagTypeId,
                TagTypeName = t.TagTypeName,
                TagName = t.TagName,
                TagValue = t.TagValue,
                Description = t.Description,
                ColorCode = t.ColorCode,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            });

            return Ok(tagDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tags");
            return StatusCode(500, new { message = "An error occurred while retrieving tags" });
        }
    }

    /// <summary>
    /// Get tag by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TagDto>> GetTagById(int id)
    {
        try
        {
            var tag = await _tagRepository.GetTagByIdAsync(id);
            if (tag == null)
            {
                return NotFound(new { message = "Tag not found" });
            }

            var tagDto = new TagDto
            {
                TagId = tag.TagId,
                TagTypeId = tag.TagTypeId,
                TagTypeName = tag.TagTypeName,
                TagName = tag.TagName,
                TagValue = tag.TagValue,
                Description = tag.Description,
                ColorCode = tag.ColorCode,
                IsActive = tag.IsActive,
                CreatedAt = tag.CreatedAt,
                UpdatedAt = tag.UpdatedAt
            };

            return Ok(tagDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tag {TagId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the tag" });
        }
    }

    /// <summary>
    /// Create a new tag (Admin only)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<TagDto>> CreateTag([FromBody] CreateTagRequestDto request)
    {
        try
        {
            var tagId = await _tagRepository.CreateTagAsync(
                request.TagTypeId,
                request.TagName,
                request.TagValue,
                request.Description,
                request.ColorCode
            );

            var tag = await _tagRepository.GetTagByIdAsync(tagId);
            if (tag == null)
            {
                return StatusCode(500, new { message = "Error retrieving created tag" });
            }

            var tagDto = new TagDto
            {
                TagId = tag.TagId,
                TagTypeId = tag.TagTypeId,
                TagTypeName = tag.TagTypeName,
                TagName = tag.TagName,
                TagValue = tag.TagValue,
                Description = tag.Description,
                ColorCode = tag.ColorCode,
                IsActive = tag.IsActive,
                CreatedAt = tag.CreatedAt,
                UpdatedAt = tag.UpdatedAt
            };

            return CreatedAtAction(nameof(GetTagById), new { id = tagId }, tagDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tag");
            return StatusCode(500, new { message = "An error occurred while creating the tag" });
        }
    }

    /// <summary>
    /// Update an existing tag (Admin only)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<TagDto>> UpdateTag(int id, [FromBody] UpdateTagRequestDto request)
    {
        try
        {
            var existingTag = await _tagRepository.GetTagByIdAsync(id);
            if (existingTag == null)
            {
                return NotFound(new { message = "Tag not found" });
            }

            await _tagRepository.UpdateTagAsync(
                id,
                request.TagName,
                request.TagValue,
                request.Description,
                request.ColorCode
            );

            var updatedTag = await _tagRepository.GetTagByIdAsync(id);
            if (updatedTag == null)
            {
                return StatusCode(500, new { message = "Error retrieving updated tag" });
            }

            var tagDto = new TagDto
            {
                TagId = updatedTag.TagId,
                TagTypeId = updatedTag.TagTypeId,
                TagTypeName = updatedTag.TagTypeName,
                TagName = updatedTag.TagName,
                TagValue = updatedTag.TagValue,
                Description = updatedTag.Description,
                ColorCode = updatedTag.ColorCode,
                IsActive = updatedTag.IsActive,
                CreatedAt = updatedTag.CreatedAt,
                UpdatedAt = updatedTag.UpdatedAt
            };

            return Ok(tagDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tag {TagId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the tag" });
        }
    }

    /// <summary>
    /// Delete a tag (Admin only, soft delete)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTag(int id)
    {
        try
        {
            var existingTag = await _tagRepository.GetTagByIdAsync(id);
            if (existingTag == null)
            {
                return NotFound(new { message = "Tag not found" });
            }

            await _tagRepository.DeleteTagAsync(id);
            return Ok(new { message = "Tag deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tag {TagId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the tag" });
        }
    }
}
