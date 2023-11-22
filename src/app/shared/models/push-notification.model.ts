export interface NotificationResponse {
    unreadCount: number;
    notifications: PushNotification[];
}
export interface PushNotification {
    id: string;
    isRead: boolean;
    subject: string;
    message: string;
    userId: string;
    bookingId: string;
    arrivalTimeStamp: number;
    departureTimeStamp: number;
    notificationStatus: number;
    arrivalTime: string;
    departureTime: string;
}
export interface GetNotificationRequest {
    pageNumber: number;
    pageSize: number;
    timeZone: string;
    isWebPortal: boolean;
}

export interface UpdateNotificationRequest {
    notificationId: string;
}