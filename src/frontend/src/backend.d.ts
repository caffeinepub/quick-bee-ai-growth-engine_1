import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WebhookLog {
    id: bigint;
    source: string;
    timestamp: bigint;
    toolName: string;
    payload: string;
}
export interface PublicLead {
    id: bigint;
    status: PublicLeadStatus;
    name: string;
    createdAt: bigint;
    email: string;
    updatedAt: bigint;
    notes: string;
    phone: string;
}
export interface SEOEntry {
    id: bigint;
    metaDescription: string;
    createdAt: bigint;
    updatedAt: bigint;
    pageUrl: string;
    targetKeywords: Array<string>;
    metaTitle: string;
}
export interface ExportPayload {
    metrics: Array<SocialMediaMetrics>;
    leads: Array<Lead>;
    posts: Array<SocialMediaPost>;
    webhookLogs: Array<WebhookLog>;
}
export interface PublicPackage {
    features: Array<string>;
    name: string;
    price: bigint;
}
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
export interface PublicService {
    id: string;
    title: string;
    packages: Array<PublicPackage>;
    sortOrder: bigint;
    description: string;
    imageUrl: string;
    addons: Array<PublicAddon>;
    isVisible: boolean;
    category: string;
}
export interface Lead {
    id: bigint;
    status: LeadStatus;
    name: string;
    createdAt: bigint;
    email: string;
    updatedAt: bigint;
    notes: string;
    phone: string;
}
export interface AdCampaign {
    id: bigint;
    clicks: bigint;
    createdAt: bigint;
    impressions: bigint;
    platform: AdPlatform;
    spend: number;
    updatedAt: bigint;
    conversions: bigint;
    budget: number;
    campaignName: string;
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
export interface PublicAddon {
    name: string;
    price: bigint;
}
export interface LandingPage {
    id: bigint;
    url: string;
    status: LandingPageStatus;
    name: string;
    createdAt: bigint;
    associatedCampaign: string;
    updatedAt: bigint;
    conversionGoal: string;
}
export interface EmailCampaign {
    id: bigint;
    status: Variant_active_sent_draft;
    bodyContent: string;
    subjectLine: string;
    createdAt: bigint;
    targetAudience: string;
    updatedAt: bigint;
    campaignName: string;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export enum AdPlatform {
    linkedin = "linkedin",
    meta = "meta",
    googleAds = "googleAds",
    youtube = "youtube"
}
export enum LandingPageStatus {
    active = "active",
    draft = "draft",
    paused = "paused"
}
export enum LeadStatus {
    won = "won",
    lost = "lost",
    in_progress = "in_progress",
    open = "open"
}
export enum PostStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    idea = "idea",
    published = "published",
    draft = "draft"
}
export enum PublicLeadStatus {
    new_ = "new",
    closed_won = "closed_won",
    contacted = "contacted",
    proposal_sent = "proposal_sent",
    qualified = "qualified"
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
export enum Variant_active_sent_draft {
    active = "active",
    sent = "sent",
    draft = "draft"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearExternalWebhookLogs(): Promise<void>;
    createAdCampaign(campaignName: string, platform: AdPlatform, budget: number, spend: number, impressions: bigint, clicks: bigint, conversions: bigint): Promise<AdCampaign>;
    createEmailCampaign(campaignName: string, subjectLine: string, bodyContent: string, targetAudience: string, status: Variant_active_sent_draft): Promise<EmailCampaign>;
    createLandingPage(name: string, url: string, associatedCampaign: string, conversionGoal: string, status: LandingPageStatus): Promise<LandingPage>;
    createLead(name: string, email: string, phone: string, status: LeadStatus, notes: string): Promise<Lead>;
    createMetrics(platform: SocialMediaPlatform, date: bigint, followers: bigint, impressions: bigint, reach: bigint, engagements: bigint, clicks: bigint, postsPublished: bigint, notes: string): Promise<SocialMediaMetrics>;
    createPost(title: string, caption: string, platform: SocialMediaPlatform, status: PostStatus, scheduledDate: bigint | null, tags: Array<string>, notes: string): Promise<SocialMediaPost>;
    createSEOEntry(pageUrl: string, targetKeywords: Array<string>, metaTitle: string, metaDescription: string): Promise<SEOEntry>;
    deleteAdCampaign(id: bigint): Promise<void>;
    deleteEmailCampaign(id: bigint): Promise<void>;
    deleteLandingPage(id: bigint): Promise<void>;
    deleteLead(id: bigint): Promise<void>;
    deleteMetrics(id: bigint): Promise<void>;
    deletePost(id: bigint): Promise<void>;
    deleteSEOEntry(id: bigint): Promise<void>;
    exportData(): Promise<ExportPayload>;
    getAdCampaign(id: bigint): Promise<AdCampaign | null>;
    getAllAdCampaigns(): Promise<Array<AdCampaign>>;
    getAllEmailCampaigns(): Promise<Array<EmailCampaign>>;
    getAllLandingPages(): Promise<Array<LandingPage>>;
    getAllLeads(): Promise<Array<Lead>>;
    getAllLeadsPagination(page: bigint, pageSize: bigint): Promise<Array<Lead>>;
    getAllMetrics(): Promise<Array<SocialMediaMetrics>>;
    getAllPosts(): Promise<Array<SocialMediaPost>>;
    getAllSEOEntries(): Promise<Array<SEOEntry>>;
    getAllServicesWithVisibility(): Promise<Array<[string, boolean]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmailCampaign(id: bigint): Promise<EmailCampaign | null>;
    getExternalWebhookLogs(): Promise<Array<WebhookLog>>;
    getLandingPage(id: bigint): Promise<LandingPage | null>;
    getLead(id: bigint): Promise<Lead | null>;
    getMetrics(id: bigint): Promise<SocialMediaMetrics | null>;
    getPost(id: bigint): Promise<SocialMediaPost | null>;
    getSEOEntry(id: bigint): Promise<SEOEntry | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importLeads(importedLeads: Array<Lead>): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    isServiceVisible(serviceName: string): Promise<boolean>;
    publicCreateLead(name: string, email: string, phone: string, status: PublicLeadStatus, notes: string): Promise<PublicLead>;
    publicCreateService(id: string, title: string, category: string, description: string, packages: Array<PublicPackage>, addons: Array<PublicAddon>, imageUrl: string, isVisible: boolean, sortOrder: bigint): Promise<PublicService>;
    publicDeleteLead(id: bigint): Promise<void>;
    publicDeleteService(id: string): Promise<void>;
    publicGetAllLeads(): Promise<Array<PublicLead>>;
    publicGetAllServices(): Promise<Array<PublicService>>;
    publicImportLeads(items: Array<{
        status: PublicLeadStatus;
        name: string;
        email: string;
        notes: string;
        phone: string;
    }>): Promise<Array<bigint>>;
    publicSeedServices(items: Array<PublicService>): Promise<bigint>;
    publicSetServiceVisibility(id: string, isVisible: boolean): Promise<void>;
    publicUpdateLead(id: bigint, name: string, email: string, phone: string, status: PublicLeadStatus, notes: string): Promise<PublicLead>;
    publicUpdateService(id: string, title: string, category: string, description: string, packages: Array<PublicPackage>, addons: Array<PublicAddon>, imageUrl: string, isVisible: boolean, sortOrder: bigint): Promise<PublicService>;
    receiveExternalWebhook(toolName: string, payload: string, source: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setServiceVisibility(serviceName: string, isVisible: boolean): Promise<void>;
    updateAdCampaign(id: bigint, campaignName: string, platform: AdPlatform, budget: number, spend: number, impressions: bigint, clicks: bigint, conversions: bigint): Promise<AdCampaign>;
    updateEmailCampaign(id: bigint, campaignName: string, subjectLine: string, bodyContent: string, targetAudience: string, status: Variant_active_sent_draft): Promise<EmailCampaign>;
    updateLandingPage(id: bigint, name: string, url: string, associatedCampaign: string, conversionGoal: string, status: LandingPageStatus): Promise<LandingPage>;
    updateLead(id: bigint, name: string, email: string, phone: string, status: LeadStatus, notes: string): Promise<Lead>;
    updateMetrics(id: bigint, platform: SocialMediaPlatform, date: bigint, followers: bigint, impressions: bigint, reach: bigint, engagements: bigint, clicks: bigint, postsPublished: bigint, notes: string): Promise<SocialMediaMetrics>;
    updatePost(id: bigint, title: string, caption: string, platform: SocialMediaPlatform, status: PostStatus, scheduledDate: bigint | null, tags: Array<string>, notes: string): Promise<SocialMediaPost>;
    updateSEOEntry(id: bigint, pageUrl: string, targetKeywords: Array<string>, metaTitle: string, metaDescription: string): Promise<SEOEntry>;
}
