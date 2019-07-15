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
export type NotificationTopic =
    | 'PLATFORM_A'
    | 'PLATFORM_B'
    | 'PLATFORM_C'
    | 'PLATFORM_D';
