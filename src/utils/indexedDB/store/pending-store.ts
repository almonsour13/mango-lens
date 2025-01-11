import { PendingItem } from "@/types/types";
import { convertBlobToBase64, convertImageToBlob } from "../../image-utils";
import { dbOperation, openDB } from "../indexedDB";
import { DB_CONFIG } from "../indexedDBconfig";

const PENDING_STORE =  DB_CONFIG.stores.pending;

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
    const imageUrl = convertImageToBlob(data.imageUrl);
    return dbOperation<number>(PENDING_STORE, 'readwrite', (store) => 
        store.add({
            ...data,
            imageUrl,
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
    await Promise.all(pendingIDs.map(id => 
        dbOperation<void>(PENDING_STORE, 'readwrite', (store) => store.delete(id))
    ));
}