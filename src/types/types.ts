export type ImageAnalysisDetails = Tree &
    Image & { analyzedImage: string } & Analysis & { diseases: (DiseaseIdentified & Disease)[] | TfJsDisease[]};

export interface TfJsDisease{
    diseaseIdentifiedID?: string;
    diseaseName:string
    likelihoodScore: number;
}
export interface ScanResult {
    treeCode: string;
    originalImage: string;
    analyzedImage: string;
    boundingBoxes?: BoundingBox[];
    diseases: (DiseaseIdentified & Disease)[] | TfJsDisease[] 
}
export interface PendingItem {
    pendingID: number;
    userID?: number;
    treeCode: string;
    imageUrl: string;
    status: number;
    addedAt: Date;
}

export interface Trash {
    trashID: number;
    userID: number;
    itemID: number;
    type: number;
    status: number;
    deletedAt: Date;
}

export interface BoundingBox {
    diseaseName: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
interface DiseaseDetected {
    disease: Disease;
    likelihoodScore: number;
}
export interface ImageDetails {
    userInfo: User;
    tree: Tree;
    image: string;
    diseaseDetected: DiseaseDetected[];
}

export interface Log {
    logID: number;
    userID: number;
    activity: string;
    type: string;
    createdAt: Date;
}
export interface Feedback {
    feedbackID: number;
    userID: number;
    description: string;
    status: number;
    feedbackAt: Date;
}
export interface Disease {
    diseaseID: number;
    diseaseName: string;
    description: string;
    status: number;
    addedAt: Date;
}
export interface DiseaseIdentified {
    diseaseidentifiedID: string;
    analysisID: string;
    diseaseID: string | null;
    diseaseName:string;
    likelihoodScore: number;
}
export interface Analysis {
    analysisID: string;
    imageID: string;
    status: number;
    analyzedAt: Date;
}
export interface Image {
    imageID: string;
    userID: string;
    treeID: string;
    imageData: string;
    status: number;
    uploadedAt: Date;
}
export interface Tree {
    treeID: string;
    userID: string;
    treeCode: string;
    description: string;
    status: number;
    addedAt: Date;
}
export interface User {
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    status: number;
    createdAt: Date;
    profileImage: string | null;
}
