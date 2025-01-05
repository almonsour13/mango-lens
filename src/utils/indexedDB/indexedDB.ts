import { boundingBox, Disease, diseaseIdentified, PendingItem, ScanResult, Tree } from "@/type/types";
import { convertBlobToBase64, convertImageToBlob } from "../image-utils";

// Define the structure of our data


interface ProcessedResult {
    tree: Tree;
    originalImage: string;
    analyzedImage:string;
    boundingBoxes:boundingBox[];
    diseases: (diseaseIdentified & Disease)[];
}

// Database configuration
const DB_NAME = 'mango-care-local-db';
const PENDING_STORE = 'pendingProcess';
const RESULT_STORE = 'processedResults';
const USER_CREDENTIALS_STORE = 'userProfileImages';
const DB_VERSION = 2; // Increment this when changing the database structure

let dbInstance: IDBDatabase | null = null;

// Open and initialize the database
export async function openDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            if (!db.objectStoreNames.contains(PENDING_STORE)) {
                db.createObjectStore(PENDING_STORE, { keyPath: 'pendingID', autoIncrement: true });
            }
            
            if (!db.objectStoreNames.contains(RESULT_STORE)) {
                db.createObjectStore(RESULT_STORE, { keyPath: 'pendingID' });
            }

            if (!db.objectStoreNames.contains(USER_CREDENTIALS_STORE)) {
                db.createObjectStore(USER_CREDENTIALS_STORE, { keyPath: 'userID' });
            }
        };
    });
}

// Helper function to perform a database operation
export async function dbOperation<T>(
    storeName: string, 
    mode: IDBTransactionMode, 
    operation: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}


interface UserDredentials {
    userID: number;
    fName: string;
    lName: string;
    email: string;
    profileImage: string | null;
}

// export async function getUserCredentials(userID: number): Promise<UserDredentials | null> {
//     const userCredentials = await dbOperation<UserDredentials | null>(USER_CREDENTIALS_STORE, 'readonly', (store) => store.get(userID));
//     if (!userCredentials) return null;
//     return {
//         ...userCredentials,
//         profileImage: convertBlobToBase64(userCredentials.profileImage)
//     }
// }

// export async function storeUserCredentials(profile: UserDredentials): Promise<void> {
//     const userID = profile.userID;
//     return dbOperation<void>(USER_CREDENTIALS_STORE, 'readwrite', (store) => 
//         store.add({...profile, userID})
//     );
// }
// export async function deleteUserCredentials(userID: number): Promise<void> {
//     return dbOperation<void>(USER_CREDENTIALS_STORE, 'readwrite', (store) => 
//         store.delete(userID)
//     );
// }






