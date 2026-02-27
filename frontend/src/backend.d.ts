import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    id: bigint;
    status: string;
    name: string;
    email: string;
    serviceInterest: string;
    notes: string;
    phone: string;
}
export interface Service {
    id: bigint;
    packages: Array<Package>;
    sortOrder: bigint;
    name: string;
    description: string;
    maintenancePlan: bigint;
    addons: Array<Addon>;
    isVisible: boolean;
    category: string;
}
export interface Package {
    features: Array<string>;
    tier: string;
    priceINR: bigint;
}
export interface Addon {
    name: string;
    price: bigint;
}
export interface backendInterface {
    createLead(name: string, email: string, phone: string, serviceInterest: string, status: string, notes: string): Promise<Lead>;
    createService(name: string, category: string, description: string, packages: Array<Package>, addons: Array<Addon>, maintenancePlan: bigint, isVisible: boolean, sortOrder: bigint): Promise<Service>;
    deleteLead(id: bigint): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    duplicateService(id: bigint): Promise<Service>;
    getLeads(): Promise<Array<Lead>>;
    getServices(): Promise<Array<Service>>;
    reorderServices(serviceIds: Array<bigint>): Promise<void>;
    updateLead(id: bigint, name: string, email: string, phone: string, serviceInterest: string, status: string, notes: string): Promise<Lead>;
    updateService(id: bigint, name: string, category: string, description: string, packages: Array<Package>, addons: Array<Addon>, maintenancePlan: bigint, isVisible: boolean, sortOrder: bigint): Promise<Service>;
}
