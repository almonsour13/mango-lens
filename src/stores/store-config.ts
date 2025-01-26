import { observable, syncState } from "@legendapp/state";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase/supabase";

const generateId = () => uuidv4();

configureSyncedSupabase({
    generateId
});
export const persistOptions = configureSynced(syncedSupabase, {
    persist: {
        plugin: observablePersistIndexedDB({
            databaseName: "mango-lens",
            version: 1,
            tableNames: [
                "tree",
                "treeimage",
                "image",
                "analysis",
                "analyzedimage",
                "disease",
                "diseaseidentified",
                "feedback",
                "trash"
            ],
        })
    },
    generateId,
    supabase,
    changesSince: "last-sync",
    fieldCreatedAt: "created_at",
    fieldUpdatedAt: "updated_at",
    fieldDeleted: "deleted",
});
export async function createResultsObservable(store: string) {
    const request = indexedDB.open("mango-lens", 1);
    console.log(store)
    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
            console.log("store name initialized:",store)
        }
    }
    return observable(
        persistOptions({
            supabase,
            collection: store,
            select: (from) => from.select('*'),
            persist: {
                name: "results",
                retrySync: true,
            },
            retry: {
                infinite: true,
            },
            changesSince: 'last-sync'
        })
    );
}

export function createStore<T>(name: string) {
    // const request = await indexedDB.open("mango-lens", 1);
    // request.onupgradeneeded = (event) => {
    //     const db = (event.target as IDBOpenDBRequest).result;
    //     if (!db.objectStoreNames.contains(name)) {
    //         db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
    //     }
    // }
    const store = observable<Record<string, T>>();
    syncObservable(
        store,
        persistOptions({
            supabase,
            collection: name,
            select: (from) => from.select('*'),
            actions: ["read", "create", "update", "delete"],
            persist: {
                name,
                retrySync: true,
            },
            retry: {
                infinite: true,
            },
            changesSince: 'last-sync'
        })
    );
    return store;
}
