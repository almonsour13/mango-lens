import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";

export const DATABASE_NAME = "mango-lens";
export const DATABASE_VERSION = 2;
export const TABLE_NAMES = [
    "tree",
    "treeimage",
    "image",
    "analysis",
    "analyzedimage",
    "disease",
    "diseaseidentified",
    "feedback",
    "feedbackResponse",
    "trash",
];
// Sync Plugin Configuration
export const syncPlugin = configureSynced(syncedCrud, {
    persist: {
        plugin: observablePersistIndexedDB({
            databaseName: DATABASE_NAME,
            version: DATABASE_VERSION,
            tableNames: TABLE_NAMES,
        }),
    },
    onError: (error) => {
        console.error("Sync error:", error);
    },
    changesSince: "last-sync",
});

