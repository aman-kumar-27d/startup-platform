import { prisma } from "@/lib/prisma";
import type { ClientHistoryActionType } from "@prisma/client";

export async function logClientHistory(
    clientId: string,
    actorId: string,
    actionType: ClientHistoryActionType,
    description: string
) {
    try {
        await prisma.clientHistory.create({
            data: {
                clientId,
                actorId,
                actionType,
                description,
            },
        });
    } catch (error) {
        console.error("Failed to log client history:", error);
        // Don't throw - history logging shouldn't break the main operation
    }
}
