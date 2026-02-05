import { Metadata } from "next";
import { PageKey } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Safe defaults when PageSEO record doesn't exist
 */
const DEFAULT_METADATA: Record<PageKey, Metadata> = {
    HOME: {
        title: "Startup Platform",
        description: "A modern platform for startup management and growth.",
    },
    SERVICES: {
        title: "Services | Startup Platform",
        description: "Discover the services we offer to help your startup succeed.",
    },
    WORK: {
        title: "Work / Portfolio | Startup Platform",
        description: "Explore our latest projects and success stories.",
    },
    ABOUT: {
        title: "About | Startup Platform",
        description: "Learn about our mission, team, and values.",
    },
    CONTACT: {
        title: "Contact | Startup Platform",
        description: "Get in touch with our team. We'd love to hear from you.",
    },
};

/**
 * Fetch PageSEO metadata from database and generate Metadata object
 * Falls back to defaults if record doesn't exist
 * Never throws - always returns safe metadata
 */
export async function generatePageMetadata(pageKey: PageKey): Promise<Metadata> {
    try {
        const pageSEO = await prisma.pageSEO.findUnique({
            where: { pageKey },
        });

        if (!pageSEO) {
            return DEFAULT_METADATA[pageKey];
        }

        const metadata: Metadata = {
            title: pageSEO.title,
            description: pageSEO.description,
            robots: pageSEO.noIndex ? "noindex" : "index, follow",
        };

        // Add optional fields if present
        if (pageSEO.keywords) {
            metadata.keywords = pageSEO.keywords;
        }

        if (pageSEO.ogTitle || pageSEO.ogDescription || pageSEO.ogImage) {
            metadata.openGraph = {
                title: pageSEO.ogTitle || pageSEO.title,
                description: pageSEO.ogDescription || pageSEO.description,
                type: "website",
                ...{
                    ...(pageSEO.ogImage && { images: [{ url: pageSEO.ogImage }] }),
                },
            };
        }

        return metadata;
    } catch (error) {
        console.error(`Failed to fetch SEO metadata for ${pageKey}:`, error);
        // Return safe defaults if database fails
        return DEFAULT_METADATA[pageKey];
    }
}
