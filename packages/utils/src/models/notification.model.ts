export interface NotificationModel {
    id: string;
    tier: 1 | 2 | 3;
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    topic: NotificationTopic;
    message: string;
    url?: string;
}

// list of all supported topics
export enum NotificationTopic {
    platformA = 'PLATFORM_A',
    platformB = 'PLATFORM_B',
    platformC = 'PLATFORM_C',
    platformD = 'PLATFORM_D'
}
