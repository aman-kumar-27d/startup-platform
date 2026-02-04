export interface ClientUser {
    id: string;
    name: string | null;
    email: string;
}

export interface ClientData {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string | null;
    website: string | null;
    lifecycleStatus: "LEAD" | "ACTIVE" | "PAST" | "LOST";
    weightage: "VIP" | "REGULAR" | "ONE_TIME" | "LOW_PRIORITY";
    relationshipLevel: "WEAK" | "WARM" | "STRONG";
    leadScore: number | null;
    expectedValue: number | null;
    isHighRisk: boolean;
    source: "Referral" | "Website" | "Cold_outreach" | "Other";
    notes: string | null;
    owner: ClientUser;
    ownerId: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ClientHistoryEntry {
    id: string;
    clientId: string;
    actionType:
    | "CREATED"
    | "STATUS_CHANGED"
    | "WEIGHTAGE_CHANGED"
    | "OWNER_CHANGED"
    | "ARCHIVED"
    | "NOTES_UPDATED"
    | "RISK_MARKED";
    description: string;
    actor: ClientUser;
    actorId: string;
    createdAt: string;
}
