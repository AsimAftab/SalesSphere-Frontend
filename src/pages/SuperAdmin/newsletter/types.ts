export interface Subscriber {
    _id: string;
    email: string;
    isActive: boolean;
    source: 'website' | 'landing-page' | 'referral' | 'other';
    createdAt: string;
    unsubscribedAt: string | null;
}

export interface SubscriberStats {
    total: number;
    active: number;
    unsubscribed: number;
}

export interface SubscribersResponse {
    status: string;
    data: Subscriber[];
    stats: SubscriberStats;
    count?: number;
}
