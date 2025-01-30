import { DATABASE_NAME, DATABASE_VERSION, TABLE_NAMES } from "./config";
import { tree$ } from "./tree";
import { treeimage$ } from "./treeimage";
import { image$ } from "./image";
import { analysis$ } from "./analysis";
import { analyzedimage$ } from "./analyzeimage";
import { diseaseidentified$ } from "./diseaseidentified";
import { trash$ } from "./trash";
import { feedback$ } from "./feedback";
import { feedbackResponse$ } from "./feedbackResponse";

export const checkAndInitializeDatabase = async () => {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME);

        request.onsuccess = async (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const currentVersion = db.version;

            console.log(`Current DB version: ${currentVersion}, Required: ${DATABASE_VERSION}`);

            if (currentVersion !== DATABASE_VERSION) {
                db.close(); // Close before deleting
                await removeOldDatabase(); // Delete outdated DB
            }

            await initializeDatabase(); // Initialize new DB
            resolve();
        };

        request.onerror = () => {
            console.error("Error opening database for version check:", request.error);
            reject(request.error);
        };

        request.onupgradeneeded = async () => {
            console.log("Database doesn't exist, initializing...");
            await initializeDatabase();
            resolve();
        };
    });
};

export const initializeStore = async () => {
    try {
        const stores: any[] = [
            tree$,
            treeimage$,
            image$,
            analysis$,
            analyzedimage$,
            diseaseidentified$,
            trash$,
            feedback$,
            feedbackResponse$,
        ];

        for (const { store } of stores) {
            (await store).get();
        }
        console.log("All stores initialized successfully");
    } catch (error) {
        console.error("Error initializing stores:", error);
        throw error;
    }
};

export const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
        let request;
        try {
            request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        } catch (error) {
            console.error("Failed to create IDBOpenDBRequest:", error);
            reject(error);
            return;
        }

        request.onerror = () => reject(request.error);

        request.onsuccess = async () => {
            console.log("Database initialized successfully");
            await initializeStore()
            resolve(request.result);
        };

        request.onblocked = (event) => {
            console.warn(
                "Database initialization blocked. Please close other tabs and retry."
            );
            reject(new Error("Database blocked"));
        };

        request.onupgradeneeded = (event) => {
            console.log("Upgrading database...");
            const db = (event.target as IDBOpenDBRequest).result;
            const existingStores = new Set(db.objectStoreNames);

            existingStores.forEach((storeName) => {
                if (!TABLE_NAMES.includes(storeName)) {
                    console.log(`Deleting outdated object store: ${storeName}`);
                    db.deleteObjectStore(storeName);
                }
            });
            TABLE_NAMES.forEach((tableName) => {
                if (!db.objectStoreNames.contains(tableName)) {
                    console.log(`Creating object store: ${tableName}`);
                    db.createObjectStore(tableName, {
                        keyPath: "id",
                        autoIncrement: true, // Changed to true for testing
                    });
                } else {
                    console.log(`Object store already exists: ${tableName}`);
                }
            });
        };

        request.onerror = (event) => {
            const error = (event.target as IDBOpenDBRequest).error;
            console.error("Database initialization error:", {
                name: error?.name as string,
                message: error?.message,
                code: error?.code,
            });
            reject(error);
        };

    });
};
export const removeOldDatabase = async () => {
    return new Promise<void>((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(DATABASE_NAME);

        deleteRequest.onsuccess = () => {
            console.log(`Database "${DATABASE_NAME}" deleted successfully.`);
            resolve();
        };

        deleteRequest.onerror = (event) => {
            console.error(
                `Error deleting database "${DATABASE_NAME}":`,
                deleteRequest.error
            );
            reject(deleteRequest.error);
        };

        deleteRequest.onblocked = () => {
            console.warn(
                `Database deletion blocked. Close all tabs using the database and retry.`
            );
            reject(new Error("Database deletion blocked"));
        };
    });
};