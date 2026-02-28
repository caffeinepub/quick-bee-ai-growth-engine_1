import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SocialMediaMetrics {
    id: bigint;
    clicks: bigint;
    engagements: bigint;
    date: bigint;
    createdAt: bigint;
    impressions: bigint;
    platform: SocialMediaPlatform;
    notes: string;
    postsPublished: bigint;
    followers: bigint;
    reach: bigint;
}
export interface SocialMediaPost {
    id: bigint;
    status: PostStatus;
    title: string;
    scheduledDate?: bigint;
    createdAt: bigint;
    tags: Array<string>;
    platform: SocialMediaPlatform;
    updatedAt: bigint;
    notes: string;
    caption: string;
}
export interface ExportPayload {
    metrics: Array<SocialMediaMetrics>;
    posts: Array<SocialMediaPost>;
    webhookLogs: Array<WebhookLog>;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export interface WebhookLog {
    id: bigint;
    source: string;
    timestamp: bigint;
    toolName: string;
    payload: string;
}
export enum PostStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    idea = "idea",
    published = "published",
    draft = "draft"
}
export enum SocialMediaPlatform {
    linkedin = "linkedin",
    tiktok = "tiktok",
    twitter = "twitter",
    other = "other",
    instagram = "instagram",
    facebook = "facebook",
    youtube = "youtube"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearExternalWebhookLogs(): Promise<void>;
    createMetrics(platform: SocialMediaPlatform, date: bigint, followers: bigint, impressions: bigint, reach: bigint, engagements: bigint, clicks: bigint, postsPublished: bigint, notes: string): Promise<SocialMediaMetrics>;
    createPost(title: string, caption: string, platform: SocialMediaPlatform, status: PostStatus, scheduledDate: bigint | null, tags: Array<string>, notes: string): Promise<SocialMediaPost>;
    deleteMetrics(id: bigint): Promise<void>;
    deletePost(id: bigint): Promise<void>;
    exportData(): Promise<ExportPayload>;
    getAllMetrics(): Promise<Array<SocialMediaMetrics>>;
    getAllPosts(): Promise<Array<SocialMediaPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExternalWebhookLogs(): Promise<Array<WebhookLog>>;
    getMetrics(id: bigint): Promise<SocialMediaMetrics | null>;
    getPost(id: bigint): Promise<SocialMediaPost | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    receiveExternalWebhook(toolName: string, payload: string, source: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMetrics(id: bigint, platform: SocialMediaPlatform, date: bigint, followers: bigint, impressions: bigint, reach: bigint, engagements: bigint, clicks: bigint, postsPublished: bigint, notes: string): Promise<SocialMediaMetrics>;
    updatePost(id: bigint, title: string, caption: string, platform: SocialMediaPlatform, status: PostStatus, scheduledDate: bigint | null, tags: Array<string>, notes: string): Promise<SocialMediaPost>;
}
