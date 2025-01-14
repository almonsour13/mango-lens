export type ImageAnalysisDetails = Tree &
    Image & { analyzedImage: string } & {
        boundingBoxes: BoundingBox[];
    } & Analysis & { diseases: (DiseaseIdentified & Disease)[] };

export interface ScanResult {
    tree: Tree | null;
    originalImage: string;
    analyzedImage: string;
    boundingBoxes: BoundingBox[];
    diseases: (DiseaseIdentified & Disease)[] | null
    predictions?: {diseaseName:string; likelihood:number}[]
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
    diseaseIdentifiedID: number;
    analysisID: number;
    diseaseID: number;
    likelihoodScore: number;
}
export interface Analysis {
    analysisID: number;
    imageID: number;
    status: number;
    analyzedAt: Date;
}
export interface Image {
    imageID: number;
    userID: number;
    treeID: number;
    imageData: string;
    status: number;
    uploadedAt: Date;
}
export interface Tree {
    treeID: number;
    userID: number;
    treeCode: string;
    description: string;
    status: number;
    addedAt: Date;
}
export interface User {
    userID: number;
    fName: string;
    lName: string;
    email: string;
    role: number;
    status: number;
    createdAt: Date;
    profileImage: string | null;
}
