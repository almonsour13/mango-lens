import type {  Tree, Analysis, DiseaseIdentified, Trash } from "@/types/types"
import { createStore } from "./store-config"

export interface AnalyzedImage {
    analyzedimageID: string;
    analysisID: string;
    imageData:Buffer;
}
interface UserInfo {
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    profileImage?: string;
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


