import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ContentBlockRecord = Record<string, unknown>;
export type ServiceRecord = Record<string, unknown>;

export interface ContentBlock {
    id: string;
    key: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    ctaText?: string | null;
    ctaLink?: string | null;
    isPublished: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export const getContentBlocks = async (): Promise<ContentBlockRecord[]> => {
    try {
        return await prisma.$queryRaw<ContentBlockRecord[]>(
            Prisma.sql`SELECT * FROM ContentBlock WHERE isPublished = 1`
        );
    } catch {
        return [];
    }
};

/**
 * Fetch published content blocks by their keys
 * Returns a map of key -> content block for easy lookup
 */
export const getContentByKeys = async (
    keys: string[]
): Promise<Map<string, ContentBlock>> => {
    try {
        const blocks = await prisma.contentBlock.findMany({
            where: {
                isPublished: true,
                key: { in: keys },
            },
        });

        const map = new Map<string, ContentBlock>();
        blocks.forEach((block) => {
            map.set(block.key, block);
        });

        return map;
    } catch (error) {
        console.error("Error fetching content blocks:", error);
        return new Map();
    }
};

/**
 * Fetch a single published content block by key
 */
export const getContentByKey = async (
    key: string
): Promise<ContentBlock | null> => {
    try {
        return await prisma.contentBlock.findFirst({
            where: {
                key,
                isPublished: true,
            },
        });
    } catch (error) {
        console.error(`Error fetching content block ${key}:`, error);
        return null;
    }
};

export const getServices = async (): Promise<ServiceRecord[]> => {
    try {
        return await prisma.$queryRaw<ServiceRecord[]>(
            Prisma.sql`SELECT * FROM Service WHERE isPublished = 1`
        );
    } catch {
        return [];
    }
};

export const getPublicProjects = async () =>
    prisma.project.findMany({
        where: { isPublic: true },
        orderBy: { updatedAt: "desc" },
    });

const normalize = (value: unknown) =>
    typeof value === "string" ? value.trim().toLowerCase() : undefined;

export const resolveText = (
    record: Record<string, unknown> | undefined,
    fields: string[]
): string | undefined => {
    if (!record) return undefined;
    for (const field of fields) {
        const value = record[field];
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }
    return undefined;
};

export const resolveIdentifier = (
    record: Record<string, unknown> | undefined,
    fields: string[] = ["slug", "key", "name", "type", "identifier", "title"]
) => {
    if (!record) return undefined;
    for (const field of fields) {
        const value = normalize(record[field]);
        if (value) return value;
    }
    return undefined;
};

export const findBlockByIdentifier = (
    blocks: ContentBlockRecord[],
    identifiers: string[]
) => {
    const normalized = identifiers.map((value) => value.toLowerCase());
    return blocks.find((block) => {
        const identifier = resolveIdentifier(block);
        return identifier ? normalized.includes(identifier) : false;
    });
};

export const filterBlocksByIdentifierPrefix = (
    blocks: ContentBlockRecord[],
    prefixes: string[]
) => {
    const normalized = prefixes.map((value) => value.toLowerCase());
    return blocks.filter((block) => {
        const identifier = resolveIdentifier(block);
        return identifier
            ? normalized.some((prefix) => identifier.startsWith(prefix))
            : false;
    });
};
