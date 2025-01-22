import { Analysis, DiseaseIdentified, ImageAnalysisDetails, Image as img, ScanResult, TfJsDisease, Trash, Tree } from "@/types/types";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import { v4 as uuidv4 } from "uuid";

export interface AnalyzedImage {
    analyzedImageID: string;
    analysisID: string;
    imageData:Buffer<ArrayBuffer>;
}
export interface Image {
    imageID: string;
    userID: number;
    treeID: string;
    imageData: Buffer<ArrayBuffer>;
    status: number;
    uploadedAt: Date;
}
// Create default persist options
const persistOptions = configureSynced({
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
                "trash"
            ],
        }),
    },
});
export const tree$ = observable<Record<string, Tree>>();
export const image$ = observable<Record<string, Image>>();
export const analysis$ = observable<Record<string, Analysis>>();
export const analyzedImage$ = observable<Record<string, AnalyzedImage>>();
// export const disease$ = observable<Record<string, Disease>>();
export const diseaseIdentified$ = observable<Record<string, DiseaseIdentified>>();
export const trash$ = observable<Record<string, Trash>>();

syncObservable(
    tree$,
    persistOptions({
        persist: {
            name: "tree",
            retrySync: true, // Retry sync after reload
        },
    })
);
syncObservable(
    image$,
    persistOptions({
        persist: {
            name: "image",
            retrySync: true,
        },
    })
);

syncObservable(
    analysis$,
    persistOptions({
        persist: {
            name: "analysis",
            retrySync: true,
        },
    })
);

syncObservable(
    analyzedImage$,
    persistOptions({
        persist: {
            name: "analyzedImage",
            retrySync: true,
        },
    })
);

syncObservable(
    diseaseIdentified$,
    persistOptions({
        persist: {
            name: "diseaseIdentified",
            retrySync: true,
        },
    })
);
syncObservable(
    diseaseIdentified$,
    persistOptions({
        persist: {
            name: "trash",
            retrySync: true,
        },
    })
);



//tree
export function addTree(
    userID: number,
    treeCode: string,
    description: string
): Tree {
    const treeID = uuidv4();
    const newTree: Tree = {
        treeID,
        userID,
        treeCode,
        description,
        status: 1,
        addedAt: new Date(),
    };
    tree$[treeID].set(newTree);
    return newTree;
}
interface TreeWithImage extends Tree {
    treeImage:string;
    recentImage: string | null;
    imagesLength: number;
}

export function getTreesByUser(userID: number):TreeWithImage[] {
    const trees = Object.values(observable(tree$).get() || {}).filter((tree) => tree.userID === userID);
    const treeWidthImage = trees.map((tree) => {
        const images = Object.values(observable(image$).get() || {}).filter((image) => image.treeID === tree.treeID);
        const recentImage = images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
        const treeImage = ""
        return {
            ...tree,
            treeImage: "",
            recentImage: recentImage?convertBlobToBase64(recentImage.imageData):null,
            imagesLength: images.length
        }
    })
    return treeWidthImage;
}
export function getTreeByID(treeID: string): Tree | null {
    const tree = tree$[treeID].get() || null;
    return tree$[treeID].get() || null;
}
interface UpdateTree{
    treeID:string,
    treeCode:string,
    description:string,
    status:number,
    treeImage?:string
}
export function updateTreeByID({treeID, treeCode, description, status, treeImage}:UpdateTree){
    const tree = tree$[treeID].get();
    if (!tree) return null;

    tree$[treeID].set({
        ...tree,
        treeCode,
        description,
        status,
    });
    return tree$[treeID].get();
}
//image
export function getImageByTreeID(treeID: string):images[] {
    const images = Object.values(observable(image$).get() || {}).filter((image) => image.treeID === treeID) as Image[];
    const treeImages = images.map((image) => {
        const analysis = Object.values(observable(analysis$).get() || {}).filter((analysis) => analysis.imageID === image.imageID)[0];
        
        const analyzedImage = Object.values(observable(analyzedImage$).get() || {}).filter((analyzedImage) => analyzedImage.analysisID === analysis?.analysisID)[0];
        const diseases =  Object.values(observable(diseaseIdentified$).get() || {}).filter((disease) => disease.analysisID === analysis?.analysisID).map((diseaseIdentified) => {
            return {
                likelihoodScore: diseaseIdentified.likelihoodScore,
                diseaseName: "Disease Name",
            };
        });
        const base64Image = convertBlobToBase64(image.imageData);
        const base64AnalyzedImage = analyzedImage?.imageData ? convertBlobToBase64(analyzedImage.imageData) : "";
        return {...image,
            imageData: base64Image || '',
            analyzedImage: base64AnalyzedImage,
            diseases
        };
        
    })
    return treeImages;

}
type images = img & { analyzedImage: string | null} & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
export function getImagesByUserID(userID:number){
    const images = Object.values(observable(image$).get() || {}).filter((image) => image.userID == userID) as Image[];
    const treeImages = images.map((image) => {
        const analysis = Object.values(observable(analysis$).get() || {}).filter((analysis) => analysis.imageID === image.imageID)[0];
        
        const analyzedImage = Object.values(observable(analyzedImage$).get() || {}).filter((analyzedImage) => analyzedImage.analysisID === analysis?.analysisID)[0];
        const diseases =  Object.values(observable(diseaseIdentified$).get() || {}).filter((disease) => disease.analysisID === analysis?.analysisID).map((diseaseIdentified) => {
            return {
                likelihoodScore: diseaseIdentified.likelihoodScore,
                diseaseName: "Disease Name",
            };
        });
        const base64Image = convertBlobToBase64(image.imageData);
        const base64AnalyzedImage = analyzedImage?.imageData ? convertBlobToBase64(analyzedImage.imageData) : "";
        return {...image,
            imageData: base64Image || '',
            analyzedImage: base64AnalyzedImage,
            diseases
        };
        
    })
    return treeImages;
}
export function getImageByID(imageID: string){
    // Get the image
    const image = image$[imageID].get();
    if (!image) return null;

    const tree = tree$[image.treeID].get();
    if (!tree) return null;

    const analyses = Object.values(analysis$.get() || {})
        .filter(a => a.imageID === imageID);
    if (!analyses.length) return null;
    const analysis = analyses[0]; 

    const analyzedImages = Object.values(analyzedImage$.get() || {})
        .filter(ai => ai.analysisID === analysis.analysisID);
    if (!analyzedImages.length) return null;
    const analyzedImage = analyzedImages[0];

    const diseases = Object.values(diseaseIdentified$.get() || {})
        .filter(d => d.analysisID === analysis.analysisID)
        .sort((a, b) => b.likelihoodScore - a.likelihoodScore);
    if (!diseases.length) return null;

    const result: ImageAnalysisDetails = {
        ...image,
        ...analysis,
        ...tree,
        diseases:diseases,
        imageData: convertBlobToBase64(image.imageData) || "",
        analyzedImage: convertBlobToBase64(analyzedImage.imageData) || "",
    };

    return result;
}
export function migrateImage(imageID:string, newTreeCode:string):Image | null{
    const image = image$[imageID].get()
    if(!image) return null;
    const tree = Object.values(tree$.get() || {})
        .filter(a => a.treeCode === newTreeCode);

    image$[imageID].set({
        ...image,
        treeID:tree[0].treeID   
    })
    return image$[imageID].get() || null
}

export async function saveScan(scanResult:ScanResult, userID: number) {
    const tree = Object.values(observable(tree$).get() || {}).filter((tree) => tree.userID === userID && tree.treeCode === scanResult.treeCode)[0];
    const image = {
        imageID:uuidv4(),
        userID,
        treeID:tree.treeID,
        imageData:convertImageToBlob(scanResult.originalImage),
        status:1,
        uploadedAt:new Date()
    }
    const analysis = {
        analysisID:uuidv4(),
        imageID:image.imageID,
        status:1,
        analyzedAt:new Date()
    }
    const analyzedImage = {
        analyzedImageID:uuidv4(),
        analysisID:analysis.analysisID,
        imageData:convertImageToBlob(scanResult.analyzedImage)
    }   

    image$[image.imageID].set(image);
    analysis$[analysis.analysisID].set(analysis);
    analyzedImage$[analyzedImage.analyzedImageID].set(analyzedImage);
    
    const diseases = scanResult.diseases as TfJsDisease[];

    diseases.map((disease) => {
        const diseaseIdentified = {
            diseaseIdentifiedID:uuidv4(),
            analysisID:analysis.analysisID,
            diseaseName:disease.diseaseName,
            diseaseID:null,
            likelihoodScore:disease.likelihoodScore
        }
        diseaseIdentified$[diseaseIdentified.diseaseIdentifiedID].set(diseaseIdentified);
    })
}
