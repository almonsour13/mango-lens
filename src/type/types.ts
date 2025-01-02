export interface ScanResult {
    tree: Tree;
    originalImage: string;
    analyzedImage: string;
    boundingBoxes: boundingBox[];
    diseases: (diseaseIdentified & Disease)[];
};

interface ProcessedResult {
    tree: Tree;
    originalImage: string;
    analyzedImage: string;
    boundingBoxes: boundingBox[];
    diseases: (diseaseIdentified & Disease)[];
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
    type: number; // 1 for Tree, 2 for Image
    status: number; // 0 for deleted, 1 for active
    deletedAt: Date;
}

export interface boundingBox {
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
export interface diseaseIdentified {
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
    profileImage:string | null;
}
