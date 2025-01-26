import type {  Tree, Analysis, DiseaseIdentified, Trash } from "@/types/types"
import { createResultsObservable, createStore } from "./store-config"
import {Observable, observable, syncState, when } from "@legendapp/state";

export interface AnalyzedImage {
    analyzedimageID: string;
    analysisID: string;
    imageData:Buffer;
}
export interface TreeImage {
    treeImageID: string;
    treeID: string;
    imageData:Buffer;
    status:Number;
    addedAt:Date
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
const tree = observable<Observable<Record<string, Tree>>>()
export const tree$ = createStore<Tree>("tree")
export const treeImage$ = createStore<TreeImage>("treeimage")
export const image$ = createStore<Image>("image")
export const analysis$ = createStore<Analysis>("analysis")
export const analyzedImage$ = createStore<AnalyzedImage>("analyzedimage")
export const diseaseIdentified$ = createStore<DiseaseIdentified>("diseaseidentified")
export const trash$ = createStore<Trash>("trash")

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
                { store: treeImage$, name: 'treeImage' },
                { store: image$, name: 'image' },
                { store: analysis$, name: 'analysis' },
                { store: analyzedImage$, name: 'analyzedImage' },
                { store: diseaseIdentified$, name: 'diseaseIdentified' },
                { store: trash$, name: 'trash' }
        ]

        for (const { store, name } of stores) {
            const existingData = (await store).get()
            if (!existingData) {
                console.log(`Initializing empty store for ${name}`)
                store.set(createResultsObservable(name));
            }
        }
        console.log('All stores initialized successfully');
    } catch (error) {
        console.error('Error initializing stores:', error);
        throw error;
    }
};

