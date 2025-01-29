import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";

const DATABASE_NAME = "mango-lens";
const DATABASE_VERSION = 1;
const TABLE_NAMES =  [
    "tree",
    "treeimage",
    "image",
    "analysis",
    "analyzedimage",
    "disease",
    "diseaseidentified",
    "feedback",
    "trash"
];
const STATUS = {
    ACTIVE: 1,
    DELETED: 2
};

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
        console.error('Sync error:', error);
    },
    changesSince: "last-sync",
});
// export const initializeStore = async () => {
//     try {
        
//             const stores:any[] = [
//                 { store: tree$, name: 'tree' },
//                 { store: treeImage$, name: 'treeImage' },
//                 { store: image$, name: 'image' },
//                 { store: analysis$, name: 'analysis' },
//                 { store: analyzedImage$, name: 'analyzedImage' },
//                 { store: diseaseIdentified$, name: 'diseaseIdentified' },
//                 { store: trash$, name: 'trash' }
//         ]

//         for (const { store, name } of stores) {
//             const existingData = (await store).get()
//             if (!existingData) {
//                 console.log(`Initializing empty store for ${name}`)
//                 store.set(createResultsObservable(name));
//             }
//         }
//         console.log('All stores initialized successfully');
//     } catch (error) {
//         console.error('Error initializing stores:', error);
//         throw error;
//     }
// };
