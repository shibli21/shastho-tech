export interface LabMetadata {
    type: "lab";
    status: "pending" | "active" | "suspended";
    accreditations: string[];
    serviceAreas: string[];
    contactPhone: string;
    contactEmail: string;
    rating: number | null;
    logoUrl: string | null;
}

export interface LabOrganization {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    metadata: LabMetadata;
    createdAt: Date;
}

/**
 * Create default lab metadata for new lab organizations
 */
export function createDefaultLabMetadata(
    overrides?: Partial<LabMetadata>
): LabMetadata {
    return {
        type: "lab",
        status: "pending",
        accreditations: [],
        serviceAreas: [],
        contactPhone: "",
        contactEmail: "",
        rating: null,
        logoUrl: null,
        ...overrides,
    };
}
