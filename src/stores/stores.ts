import { analysis$ } from "./analysis";
import { analyzedimage$ } from "./analyzeimage";
import { diseaseidentified$ } from "./diseaseidentified";
import { image$ } from "./image";
import { trash$ } from "./trash";
import { tree$ } from "./tree";

// export default {
//     tree$,
//     image$,
//     analysis$,
//     analyzedimage$,
//     diseaseidentified$,
//     trash$
// };

export const clearDatabase = async () => {
    const dbName = 'mango-lens';
    
    // Close any existing connections
    const databases = await window.indexedDB.databases();
    const currentDB = databases.find(db => db.name === dbName);
    if (currentDB) {
        const closeRequest = indexedDB.open(dbName);
        closeRequest.onsuccess = (event: any) => {
            const db = event.target.result;
            db.close();
            // Now delete the database
            const request = indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => {
                console.log(`Database "${dbName}" deleted successfully.`);
            };
            request.onerror = (event) => {
                console.error(`Error deleting database "${dbName}":`, event.target);
            };
        };
    }
};

export const initializeStore = async () => {
    try {
        
            const stores:any[] = [
                { store: tree$, name: 'tree' },
                // { store: treeImage$, name: 'treeImage' },
                { store: image$, name: 'image' },
                { store: analysis$, name: 'analysis' },
                { store: analyzedimage$, name: 'analyzedImage' },
                { store: diseaseidentified$, name: 'diseaseIdentified' },
                { store: trash$, name: 'trash' }
        ]

        for (const { store, name } of stores) {
            const existingData = store.get()
        }
        console.log('All stores initialized successfully');
    } catch (error) {
        console.error('Error initializing stores:', error);
        throw error;
    }
};

