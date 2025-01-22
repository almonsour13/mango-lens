import { observable } from "@legendapp/state";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced, syncObservable } from "@legendapp/state/sync";

// Create default persist options
export const persistOptions = configureSynced({
    persist: {
        plugin: observablePersistIndexedDB({
            databaseName: "Legend",
            version: 1,
            tableNames: [
                "tree",
                "image",
                "analysis",
                "analyzedImage",
                "disease",
                "diseaseIdentified",
                "feedback",
                "trash",
            ],
        }),
    },
});

export function createStore<T>(name: string) {
    const store = observable<Record<string, T>>();
    syncObservable(
        store,
        persistOptions({
            persist: {
                name,
                retrySync: true,
            },
        })
    );
    return store;
}
