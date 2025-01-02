export const DB_CONFIG = {
    name: 'mango-care-local-db',
    version: 2,
    stores: {
        pending: 'pendingProcess',
        result: 'processedResults',
        user: 'userProfileImages'
    }
} as const;