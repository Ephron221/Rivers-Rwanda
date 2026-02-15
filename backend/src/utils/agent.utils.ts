import { query } from '../database/connection';

/**
 * Retrieves the agent ID associated with a given user ID.
 * @param userId The user ID of the agent.
 * @returns A promise that resolves to the agent ID string, or null if not found or on error.
 */
export const getAgentId = async (userId: string | undefined): Promise<string | null> => {
    if (!userId) return null;
    try {
        const result = await query<any[]>('SELECT id FROM agents WHERE user_id = ?', [userId]);
        return result.length > 0 ? result[0].id : null;
    } catch (error) {
        console.error("Error fetching agent ID:", error);
        return null; // Return null to prevent crashing the caller
    }
};
