import { ScanResult } from "@/type/types";
import { dbOperation, openDB } from "../indexedDB";
import { DB_CONFIG } from "../indexedDBconfig";

const RESULT_STORE =  DB_CONFIG.stores.result;

export async function saveProcessedResult(
    pendingID: number,
    result: ScanResult
): Promise<void> {
    await dbOperation<void>(RESULT_STORE, "readwrite", (store) =>
        store.add({ pendingID, ...result })
    );
}

// Function to get a specific pending item
export async function getProcessedResultItem(pendingID: number): Promise<ScanResult | null> {
    return dbOperation<ScanResult | null>(RESULT_STORE, 'readonly', (store) => store.get(pendingID));
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