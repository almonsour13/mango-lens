import { Disease, diseaseIdentified, Tree } from "@/type/types";
import { convertBlobToBase64, convertImageToBlob } from "../image-utils";

// Define the structure of our data
interface PendingItem {
    pendingID: number;
    userID?: number;
    treeCode: string;
    imageUrl: string;
    status: number;
    addedAt: Date;
}
type boundingBox = {diseaseName:string, x:number, y:number, w:number, h:number}

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
async function openDB(): Promise<IDBDatabase> {
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
async function dbOperation<T>(
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
export async function getPendingTotalCount(): Promise<number> {
    return dbOperation<number>(PENDING_STORE, 'readonly', (store) => store.count());
}
export async function getAllPendingProcessItems(userID: number): Promise<PendingItem[]> {
    const allItems = await dbOperation<PendingItem[]>(PENDING_STORE, 'readonly', (store) => store.getAll());
    const processedItems = allItems.map((pending) => ({
        ...pending,
        imageUrl: convertBlobToBase64(pending.imageUrl)
    })) as PendingItem[];

    return processedItems.filter(item => item.userID === userID);
}

export async function storePendingProcessItem(data: Omit<PendingItem, 'pendingID' | 'status' | 'addedAt'>): Promise<number> {
    const imageUrl = convertImageToBlob(data.imageUrl)
    return dbOperation<number>(PENDING_STORE, 'readwrite', (store) => 
        store.add({
            ...data,
            imageUrl:imageUrl,
            status: 1,
            addedAt: new Date(),
        })
    );
}

export async function updatePendingProcessItem(pendingID: number, newStatus: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PENDING_STORE, "readwrite");
        const store = transaction.objectStore(PENDING_STORE);

        const getRequest = store.get(pendingID);

        getRequest.onerror = () => {
            console.error(`Error fetching item with ID ${pendingID}:`, getRequest.error);
            reject(getRequest.error);
        };

        getRequest.onsuccess = () => {
            const item = getRequest.result;
            if (!item) {
                const error = new Error(`Pending item with ID ${pendingID} not found`);
                console.error(error);
                reject(error);
                return;
            }

            console.log(`Current status for item ${pendingID}:`, item.status);
            item.status = newStatus;
            console.log(`Updating status for item ${pendingID} to:`, newStatus);

            const putRequest = store.put(item);

            putRequest.onerror = () => {
                console.error(`Error updating item with ID ${pendingID}:`, putRequest.error);
                reject(putRequest.error);
            };

            putRequest.onsuccess = () => {
                console.log(`Successfully updated status for item ${pendingID} to ${newStatus}`);
                resolve();
            };
        };
    });
}

export async function deleteSelectedPendingProcessItems(pendingIDs: number[]): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction(PENDING_STORE, 'readwrite');
    const store = transaction.objectStore(PENDING_STORE);

    await Promise.all(pendingIDs.map(id => 
        new Promise<void>((resolve, reject) => {
            const request = store.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        })
    ));
}

export async function saveProcessedResult(pendingID: number, result: ProcessedResult): Promise<void> {
    await dbOperation<void>(RESULT_STORE, 'readwrite', (store) => 
        store.add({ pendingID, ...result })
    );
}

// Function to get a specific pending item
export async function getProcessedResultItem(pendingID: number): Promise<ProcessedResult | null> {
    return dbOperation<ProcessedResult | null>(RESULT_STORE, 'readonly', (store) => store.get(pendingID));
}
export async function deleteProcessedResult(pendingIDs: number[]): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction(RESULT_STORE, 'readwrite');
    const store = transaction.objectStore(RESULT_STORE);

    await Promise.all(pendingIDs.map(id => 
        new Promise<void>((resolve, reject) => {
            const request = store.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        })
    ));
}

interface UserDredentials {
    userID: number;
    fName: string;
    lName: string;
    email: string;
    profileImage: string | null;
}

export async function getUserCredentials(userID: number): Promise<UserDredentials | null> {
    const userCredentials = await dbOperation<UserDredentials | null>(USER_CREDENTIALS_STORE, 'readonly', (store) => store.get(userID));
    if (!userCredentials) return null;
    return {
        ...userCredentials,
        profileImage: convertBlobToBase64(userCredentials.profileImage)
    }
}

export async function storeUserCredentials(profile: UserDredentials): Promise<void> {
    const userID = profile.userID;
    return dbOperation<void>(USER_CREDENTIALS_STORE, 'readwrite', (store) => 
        store.add({...profile, userID})
    );
}
export async function updateUserCredentials(userID: number, profile: Partial<UserDredentials>): Promise<void> {  
    return dbOperation<void>(USER_CREDENTIALS_STORE, 'readwrite', (store) => 
        store.put({...profile, userID})
    );
}
export async function deleteUserCredentials(userID: number): Promise<void> {
    return dbOperation<void>(USER_CREDENTIALS_STORE, 'readwrite', (store) => 
        store.delete(userID)
    );
}






