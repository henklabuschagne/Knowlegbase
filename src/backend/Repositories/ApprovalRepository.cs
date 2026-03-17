using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;
using KnowledgeBase.Models;

namespace KnowledgeBase.Repositories;

public interface IApprovalRepository
{
    Task<PaginatedResult<ApprovalDto>> GetPendingApprovalsAsync(int? approverUserId, ApprovalQueryParams queryParams);
    Task<int> SubmitForApprovalAsync(SubmitApprovalDto dto, int submittedByUserId);
    Task ApproveAsync(int approvalId, int approverUserId, string? comments);
    Task RejectAsync(int approvalId, int approverUserId, string comments);
}

public class ApprovalRepository : IApprovalRepository
{
    private readonly string _connectionString;

    public ApprovalRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<PaginatedResult<ApprovalDto>> GetPendingApprovalsAsync(int? approverUserId, ApprovalQueryParams queryParams)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            ApproverUserId = approverUserId,
            ApprovalLevel = queryParams.ApprovalLevel,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };

        var approvals = await connection.QueryAsync<ApprovalDto>(
            "sp_GetPendingApprovals",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var approvalList = approvals.ToList();
        var totalCount = approvalList.FirstOrDefault()?.TotalCount ?? 0;

        return new PaginatedResult<ApprovalDto>
        {
            Data = approvalList,
            TotalCount = totalCount,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<int> SubmitForApprovalAsync(SubmitApprovalDto dto, int submittedByUserId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            ArticleId = dto.ArticleId,
            ArticleVersionId = dto.ArticleVersionId,
            SubmittedByUserId = submittedByUserId,
            ApprovalLevel = dto.ApprovalLevel
        };

        var result = await connection.QueryFirstAsync<int>(
            "sp_SubmitArticleForApproval",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result;
    }

    public async Task ApproveAsync(int approvalId, int approverUserId, string? comments)
    {
        using var connection = new SqlConnection(_connectionString);
        
        await connection.ExecuteAsync(
            "sp_ApproveArticle",
            new { ApprovalId = approvalId, ApproverUserId = approverUserId, Comments = comments },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task RejectAsync(int approvalId, int approverUserId, string comments)
    {
        using var connection = new SqlConnection(_connectionString);
        
        await connection.ExecuteAsync(
            "sp_RejectArticle",
            new { ApprovalId = approvalId, ApproverUserId = approverUserId, Comments = comments },
            commandType: CommandType.StoredProcedure
        );
    }
}
