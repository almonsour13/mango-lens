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

export function createStore<T>(name: string) {
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
