import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SocialMediaPlatform, PostStatus, AdPlatform, LandingPageStatus, Variant_active_sent_draft } from '../backend';
import type { SocialMediaPost, SocialMediaMetrics, WebhookLog, AdCampaign, EmailCampaign, LandingPage, SEOEntry } from '../backend';
import { seedServices } from '../data/seedServices';

// Local type definitions for Lead and Service (no longer in backend)
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  status: string;
  notes: string;
}

export interface Package {
  name: string;
  price: bigint;
  features: string[];
}

export interface Addon {
  name: string;
  price: bigint;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  packages: Package[];
  addons: Addon[];
  imageUrl?: string;
  isVisible: boolean;
}

// ============================================================
// LEADS HOOKS (stubbed - backend no longer has lead storage)
// ============================================================

export function useGetAllLeads() {
  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      return [];
    },
    enabled: true,
  });
}

// Alias for backward compatibility
export const useLeads = useGetAllLeads;

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_lead: Omit<Lead, 'id'>) => {
      throw new Error('Lead creation is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_lead: Lead) => {
      throw new Error('Lead update is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error('Lead deletion is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// ============================================================
// SERVICES HOOKS (seed data - backend no longer has service storage)
// ============================================================

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      return seedServices.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        packages: (s.packages ?? []).map((p) => ({
          name: p.name,
          price: BigInt(Math.round(p.price)),
          features: p.features ?? [],
        })),
        addons: (s.addons ?? []).map((a) => ({
          name: a.name,
          price: BigInt(Math.round(a.price)),
        })),
        imageUrl: undefined,
        isVisible: s.isVisible,
      }));
    },
    enabled: true,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_service: Omit<Service, 'id'>) => {
      throw new Error('Service creation is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_service: Service) => {
      throw new Error('Service update is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error('Service deletion is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDuplicateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error('Service duplication is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useReorderServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_serviceIds: string[]) => {
      throw new Error('Service reordering is not supported in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// ============================================================
// EXPORT DATA HOOKS
// ============================================================

export function useExportData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['exportData'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.exportData();
    },
    enabled: !!actor && !isFetching,
  });
}

// ============================================================
// SOCIAL MEDIA POSTS HOOKS
// ============================================================

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: {
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(post.title, post.caption, post.platform, post.status, post.scheduledDate, post.tags, post.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: {
      id: bigint;
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePost(post.id, post.title, post.caption, post.platform, post.status, post.scheduledDate, post.tags, post.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ============================================================
// SOCIAL MEDIA METRICS HOOKS
// ============================================================

export function useGetAllMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaMetrics[]>({
    queryKey: ['metrics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (m: {
      platform: SocialMediaPlatform;
      date: bigint;
      followers: bigint;
      impressions: bigint;
      reach: bigint;
      engagements: bigint;
      clicks: bigint;
      postsPublished: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMetrics(m.platform, m.date, m.followers, m.impressions, m.reach, m.engagements, m.clicks, m.postsPublished, m.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useUpdateMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (m: {
      id: bigint;
      platform: SocialMediaPlatform;
      date: bigint;
      followers: bigint;
      impressions: bigint;
      reach: bigint;
      engagements: bigint;
      clicks: bigint;
      postsPublished: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMetrics(m.id, m.platform, m.date, m.followers, m.impressions, m.reach, m.engagements, m.clicks, m.postsPublished, m.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useDeleteMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMetrics(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

// ============================================================
// EXTERNAL WEBHOOKS HOOKS
// ============================================================

export function useGetExternalWebhookLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<WebhookLog[]>({
    queryKey: ['webhookLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExternalWebhookLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClearExternalWebhookLogs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearExternalWebhookLogs();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhookLogs'] });
    },
  });
}

// ============================================================
// AD CAMPAIGNS HOOKS
// ============================================================

export function useGetAllAdCampaigns() {
  const { actor, isFetching } = useActor();
  return useQuery<AdCampaign[]>({
    queryKey: ['adCampaigns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useAdCampaigns = useGetAllAdCampaigns;

export function useCreateAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAdCampaign(c.campaignName, c.platform, c.budget, c.spend, c.impressions, c.clicks, c.conversions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adCampaigns'] });
    },
  });
}

export function useUpdateAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      id: bigint;
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdCampaign(c.id, c.campaignName, c.platform, c.budget, c.spend, c.impressions, c.clicks, c.conversions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adCampaigns'] });
    },
  });
}

export function useDeleteAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAdCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adCampaigns'] });
    },
  });
}

// ============================================================
// EMAIL CAMPAIGNS HOOKS
// ============================================================

export function useGetAllEmailCampaigns() {
  const { actor, isFetching } = useActor();
  return useQuery<EmailCampaign[]>({
    queryKey: ['emailCampaigns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmailCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useEmailCampaigns = useGetAllEmailCampaigns;

export function useCreateEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEmailCampaign(c.campaignName, c.subjectLine, c.bodyContent, c.targetAudience, c.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
}

export function useUpdateEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      id: bigint;
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmailCampaign(c.id, c.campaignName, c.subjectLine, c.bodyContent, c.targetAudience, c.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
}

export function useDeleteEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEmailCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
}

// ============================================================
// LANDING PAGES HOOKS
// ============================================================

export function useGetAllLandingPages() {
  const { actor, isFetching } = useActor();
  return useQuery<LandingPage[]>({
    queryKey: ['landingPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLandingPages();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useLandingPages = useGetAllLandingPages;

export function useCreateLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLandingPage(p.name, p.url, p.associatedCampaign, p.conversionGoal, p.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPages'] });
    },
  });
}

export function useUpdateLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: bigint;
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLandingPage(p.id, p.name, p.url, p.associatedCampaign, p.conversionGoal, p.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPages'] });
    },
  });
}

export function useDeleteLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLandingPage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPages'] });
    },
  });
}

// ============================================================
// SEO ENTRIES HOOKS
// ============================================================

export function useGetAllSEOEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<SEOEntry[]>({
    queryKey: ['seoEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSEOEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useSEOEntries = useGetAllSEOEntries;

export function useCreateSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSEOEntry(entry.pageUrl, entry.targetKeywords, entry.metaTitle, entry.metaDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seoEntries'] });
    },
  });
}

export function useUpdateSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      id: bigint;
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSEOEntry(entry.id, entry.pageUrl, entry.targetKeywords, entry.metaTitle, entry.metaDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seoEntries'] });
    },
  });
}

export function useDeleteSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSEOEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seoEntries'] });
    },
  });
}
