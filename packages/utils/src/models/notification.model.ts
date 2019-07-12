export interface NotificationModel {
    id: string;
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    message: string;
    url?: string;
}
