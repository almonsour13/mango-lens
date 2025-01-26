import type {  Tree, Analysis, DiseaseIdentified, Trash } from "@/types/types"
import { createStore } from "./store-config"
import { syncState, when } from "@legendapp/state";

export interface AnalyzedImage {
    analyzedimageID: string;
    analysisID: string;
    imageData:Buffer;
}
export interface Image {
    imageID: string;
    userID: string;
    treeID: string;
    imageData: Buffer;
    status: number;
    uploadedAt: Date;
}
// export const userInfo$ = createStore<UserInfo>("userInfo")
export const tree$ = createStore<Tree>("tree")
export const image$ = createStore<Image>("image")
export const analysis$ = createStore<Analysis>("analysis")
export const analyzedImage$ = createStore<AnalyzedImage>("analyzedimage")
export const diseaseIdentified$ = createStore<DiseaseIdentified>("diseaseidentified")
export const trash$ = createStore<Trash>("trash")

export const clearDatabase = async () => {
    const dbName = 'mango-lens'
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
        console.log(`Database "${dbName}" deleted successfully.`);
    };

    request.onerror = (event) => {
        console.error(`Error deleting database "${dbName}":`, event.target);
    };

    request.onblocked = () => {
        console.warn(`Database deletion blocked. Close all open connections to "${dbName}" and try again.`);
    };
};

export const initializeStore = async () => {
    try {
        await Promise.all([
            tree$.get(),
            image$.get(),
            analysis$.get(),
            analyzedImage$.get(),
            diseaseIdentified$.get(),
            trash$.get()
        ]);
        console.log('All stores initialized successfully');
    } catch (error) {
        console.error('Error initializing stores:', error);
        throw error;
    }
};

