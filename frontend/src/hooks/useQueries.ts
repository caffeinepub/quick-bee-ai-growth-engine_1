import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead, Service, Package, Addon } from '../backend';

// ---- Leads ----
export function useLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; email: string; phone: string;
      serviceInterest: string; status: string; notes: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createLead(data.name, data.email, data.phone, data.serviceInterest, data.status, data.notes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; email: string; phone: string;
      serviceInterest: string; status: string; notes: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateLead(data.id, data.name, data.email, data.phone, data.serviceInterest, data.status, data.notes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useDeleteLead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteLead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

// ---- Services ----
export function useServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; category: string; description: string;
      packages: Package[]; addons: Addon[];
      maintenancePlan: bigint; isVisible: boolean; sortOrder: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createService(
        data.name, data.category, data.description,
        data.packages, data.addons,
        data.maintenancePlan, data.isVisible, data.sortOrder
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; category: string; description: string;
      packages: Package[]; addons: Addon[];
      maintenancePlan: bigint; isVisible: boolean; sortOrder: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateService(
        data.id, data.name, data.category, data.description,
        data.packages, data.addons,
        data.maintenancePlan, data.isVisible, data.sortOrder
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useDuplicateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.duplicateService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useReorderServices() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (serviceIds: bigint[]) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.reorderServices(serviceIds);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}
