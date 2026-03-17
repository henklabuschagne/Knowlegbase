using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;
using KnowledgeBase.Models;

namespace KnowledgeBase.Repositories;

public interface INotificationRepository
{
    Task<PaginatedResult<NotificationDto>> GetNotificationsByUserIdAsync(int userId, NotificationQueryParams queryParams);
    Task<int> GetUnreadCountAsync(int userId);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
    Task<int> MarkAllAsReadAsync(int userId);
}

public class NotificationRepository : INotificationRepository
{
    private readonly string _connectionString;

    public NotificationRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<PaginatedResult<NotificationDto>> GetNotificationsByUserIdAsync(int userId, NotificationQueryParams queryParams)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            UserId = userId,
            IsRead = queryParams.IsRead,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };

        var notifications = await connection.QueryAsync<dynamic>(
            "sp_GetNotificationsByUserId",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var notificationList = notifications.Select(n => new NotificationDto
        {
            NotificationId = n.NotificationId,
            UserId = n.UserId,
            Title = n.Title,
            Message = n.Message,
            NotificationType = n.NotificationType,
            RelatedEntityType = n.RelatedEntityType,
            RelatedEntityId = n.RelatedEntityId,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt,
            ReadAt = n.ReadAt,
            TotalCount = n.TotalCount
        }).ToList();
        
        var totalCount = notificationList.FirstOrDefault()?.TotalCount ?? 0;

        return new PaginatedResult<NotificationDto>
        {
            Data = notificationList,
            TotalCount = totalCount,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var result = await connection.QueryFirstAsync<int>(
            "sp_GetUnreadNotificationCount",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        return result;
    }

    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var result = await connection.QueryFirstAsync<int>(
            "sp_MarkNotificationAsRead",
            new { NotificationId = notificationId, UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        return result > 0;
    }

    public async Task<int> MarkAllAsReadAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var result = await connection.QueryFirstAsync<int>(
            "sp_MarkAllNotificationsAsRead",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        return result;
    }
}