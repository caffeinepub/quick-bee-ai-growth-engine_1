import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  ExportPayload, SocialMediaPost, SocialMediaMetrics, WebhookLog,
  SEOEntry, EmailCampaign, AdCampaign, LandingPage,
} from '../backend';
import {
  SocialMediaPlatform, PostStatus, AdPlatform, LandingPageStatus, Variant_active_sent_draft,
} from '../backend';

// ---- Local types for legacy pages (Lead/Service no longer in backend) ----
export interface Package {
  tier: string;
  priceINR: bigint;
  features: string[];
}

export interface Addon {
  name: string;
  price: bigint;
}

export interface Lead {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  status: string;
  notes: string;
}

export interface Service {
  id: bigint;
  name: string;
  category: string;
  description: string;
  packages: Package[];
  addons: Addon[];
  maintenancePlan: bigint;
  isVisible: boolean;
  sortOrder: bigint;
}

// ---- Leads (stubbed - backend no longer has these methods) ----
export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: {
      name: string; email: string; phone: string;
      serviceInterest: string; status: string; notes: string;
    }): Promise<Lead> => {
      throw new Error('Lead management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: {
      id: bigint; name: string; email: string; phone: string;
      serviceInterest: string; status: string; notes: string;
    }): Promise<Lead> => {
      throw new Error('Lead management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: bigint): Promise<void> => {
      throw new Error('Lead management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

// ---- Services (stubbed - backend no longer has these methods) ----
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: {
      name: string; category: string; description: string;
      packages: Package[]; addons: Addon[];
      maintenancePlan: bigint; isVisible: boolean; sortOrder: bigint;
    }): Promise<Service> => {
      throw new Error('Service management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: {
      id: bigint; name: string; category: string; description: string;
      packages: Package[]; addons: Addon[];
      maintenancePlan: bigint; isVisible: boolean; sortOrder: bigint;
    }): Promise<Service> => {
      throw new Error('Service management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: bigint): Promise<void> => {
      throw new Error('Service management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useDuplicateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: bigint): Promise<Service> => {
      throw new Error('Service management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useReorderServices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_serviceIds: bigint[]): Promise<void> => {
      throw new Error('Service management is not available in this version');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

// ---- Export ----
export function useExportData() {
  const { actor, isFetching } = useActor();
  return useQuery<ExportPayload>({
    queryKey: ['exportData'],
    queryFn: async () => {
      if (!actor) return { posts: [], metrics: [], webhookLogs: [] };
      return actor.exportData();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Social Media Posts ----
export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaPost[]>({
    queryKey: ['socialMediaPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createPost(
        data.title,
        data.caption,
        data.platform,
        data.status,
        data.scheduledDate,
        data.tags,
        data.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaPosts'] }),
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updatePost(
        data.id,
        data.title,
        data.caption,
        data.platform,
        data.status,
        data.scheduledDate,
        data.tags,
        data.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaPosts'] }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deletePost(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaPosts'] }),
  });
}

// ---- Social Media Metrics ----
export function useGetAllMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaMetrics[]>({
    queryKey: ['socialMediaMetrics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMetrics() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
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
      if (!actor) throw new Error('Actor not ready');
      return actor.createMetrics(
        data.platform,
        data.date,
        data.followers,
        data.impressions,
        data.reach,
        data.engagements,
        data.clicks,
        data.postsPublished,
        data.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaMetrics'] }),
  });
}

export function useUpdateMetrics() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
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
      if (!actor) throw new Error('Actor not ready');
      return actor.updateMetrics(
        data.id,
        data.platform,
        data.date,
        data.followers,
        data.impressions,
        data.reach,
        data.engagements,
        data.clicks,
        data.postsPublished,
        data.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaMetrics'] }),
  });
}

export function useDeleteMetrics() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteMetrics(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['socialMediaMetrics'] }),
  });
}

// ---- External Webhooks ----
export function useGetExternalWebhookLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<WebhookLog[]>({
    queryKey: ['externalWebhookLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExternalWebhookLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClearExternalWebhookLogs() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.clearExternalWebhookLogs();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['externalWebhookLogs'] }),
  });
}

// ---- Digital Marketing: SEO Entries ----
export function useSEOEntries() {
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

export function useCreateSEOEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createSEOEntry(
        data.pageUrl,
        data.targetKeywords,
        data.metaTitle,
        data.metaDescription
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seoEntries'] }),
  });
}

export function useUpdateSEOEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateSEOEntry(
        data.id,
        data.pageUrl,
        data.targetKeywords,
        data.metaTitle,
        data.metaDescription
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seoEntries'] }),
  });
}

export function useDeleteSEOEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteSEOEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seoEntries'] }),
  });
}

// ---- Digital Marketing: Email Campaigns ----
export function useEmailCampaigns() {
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

export function useCreateEmailCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createEmailCampaign(
        data.campaignName,
        data.subjectLine,
        data.bodyContent,
        data.targetAudience,
        data.status
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emailCampaigns'] }),
  });
}

export function useUpdateEmailCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateEmailCampaign(
        data.id,
        data.campaignName,
        data.subjectLine,
        data.bodyContent,
        data.targetAudience,
        data.status
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emailCampaigns'] }),
  });
}

export function useDeleteEmailCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteEmailCampaign(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emailCampaigns'] }),
  });
}

// ---- Digital Marketing: Ad Campaigns ----
export function useAdCampaigns() {
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

export function useCreateAdCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createAdCampaign(
        data.campaignName,
        data.platform,
        data.budget,
        data.spend,
        data.impressions,
        data.clicks,
        data.conversions
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adCampaigns'] }),
  });
}

export function useUpdateAdCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateAdCampaign(
        data.id,
        data.campaignName,
        data.platform,
        data.budget,
        data.spend,
        data.impressions,
        data.clicks,
        data.conversions
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adCampaigns'] }),
  });
}

export function useDeleteAdCampaign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteAdCampaign(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adCampaigns'] }),
  });
}

// ---- Digital Marketing: Landing Pages ----
export function useLandingPages() {
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

export function useCreateLandingPage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createLandingPage(
        data.name,
        data.url,
        data.associatedCampaign,
        data.conversionGoal,
        data.status
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['landingPages'] }),
  });
}

export function useUpdateLandingPage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateLandingPage(
        data.id,
        data.name,
        data.url,
        data.associatedCampaign,
        data.conversionGoal,
        data.status
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['landingPages'] }),
  });
}

export function useDeleteLandingPage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteLandingPage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['landingPages'] }),
  });
}
