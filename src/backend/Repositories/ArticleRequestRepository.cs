using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;
using KnowledgeBase.Models;

namespace KnowledgeBase.Repositories;

public interface IArticleRequestRepository
{
    Task<PaginatedResult<ArticleRequestDto>> GetArticleRequestsAsync(ArticleRequestQueryParams queryParams);
    Task<ArticleRequestDto?> GetArticleRequestByIdAsync(int requestId);
    Task<ArticleRequestDto> CreateArticleRequestAsync(CreateArticleRequestDto dto, int requestedByUserId);
    Task<ArticleRequestDto?> UpdateArticleRequestAsync(int requestId, UpdateArticleRequestDto dto);
}

public class ArticleRequestRepository : IArticleRequestRepository
{
    private readonly string _connectionString;

    public ArticleRequestRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<PaginatedResult<ArticleRequestDto>> GetArticleRequestsAsync(ArticleRequestQueryParams queryParams)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            StatusId = queryParams.StatusId,
            RequestedByUserId = queryParams.RequestedByUserId,
            AssignedToUserId = queryParams.AssignedToUserId,
            Priority = queryParams.Priority,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };

        var requests = await connection.QueryAsync<ArticleRequestDto>(
            "sp_GetArticleRequests",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var requestList = requests.ToList();
        var totalCount = requestList.FirstOrDefault()?.TotalCount ?? 0;

        return new PaginatedResult<ArticleRequestDto>
        {
            Data = requestList,
            TotalCount = totalCount,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<ArticleRequestDto?> GetArticleRequestByIdAsync(int requestId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        return await connection.QueryFirstOrDefaultAsync<ArticleRequestDto>(
            "sp_GetArticleRequestById",
            new { RequestId = requestId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<ArticleRequestDto> CreateArticleRequestAsync(CreateArticleRequestDto dto, int requestedByUserId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            Title = dto.Title,
            Description = dto.Description,
            RequestedByUserId = requestedByUserId,
            Priority = dto.Priority
        };

        var result = await connection.QueryFirstAsync<ArticleRequestDto>(
            "sp_CreateArticleRequest",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result;
    }

    public async Task<ArticleRequestDto?> UpdateArticleRequestAsync(int requestId, UpdateArticleRequestDto dto)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            RequestId = requestId,
            Title = dto.Title,
            Description = dto.Description,
            StatusId = dto.StatusId,
            Priority = dto.Priority,
            AssignedToUserId = dto.AssignedToUserId,
            RejectionReason = dto.RejectionReason,
            ArticleId = dto.ArticleId
        };

        return await connection.QueryFirstOrDefaultAsync<ArticleRequestDto>(
            "sp_UpdateArticleRequest",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
}
