import { v4 as uuidv4 } from "uuid";
import {
    image$,
    analysis$,
    analyzedImage$,
    diseaseIdentified$,
    tree$,
} from "./stores";
import type {
    Image as Img,
    ImageAnalysisDetails,
    ScanResult,
    TfJsDisease,
} from "@/types/types";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
type images = Img & { analyzedImage: string | null } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
export interface Image {
    imageID: string;
    userID: string;
    treeID: string;
    imageData: Buffer;
    status: number;
    uploadedAt: Date;
}
export function getImageByTreeID(treeID: string): images[] {
    const images = Object.values(observable(image$).get() || {}).filter(
        (image) => image.treeID === treeID
    );
    const f = images.map((image) => {
        const an = Object.values(
            observable(analysis$).get() || {}
        ).filter((a) => a.imageID === image.imageID)[0];
        const analyzedimage = Object.values(
            observable(analyzedImage$).get() || {}
        ).filter((ai) => ai.analysisID === an.analysisID)[0];
        const diseases = Object.values(
            observable(diseaseIdentified$).get() || {}
        ).filter(
            (d) => d.analysisID === an.analysisID && d.likelihoodScore > 0.5
        );
        
        const base64Image = convertBlobToBase64(image.imageData);
        return {
            ...image,
            imageData: base64Image || "",
            analyzedImage: convertBlobToBase64(analyzedimage.imageData),
            diseases: diseases.map((d) => {
                return {
                    diseaseName: d.diseaseName,
                    likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                };
            }),
        };
    });
    return f;
}

export function getImagesByUserID(userID: string) {
    const images = Object.values(observable(image$).get() || {}).filter(
        (image) => image.userID == userID
    );
    const trees = Object.values(observable(tree$).get() || {});
    const t = images.map((image) => {
        const treeCode = trees.filter((t) => t.treeID === image.treeID)[0]
            .treeCode;
        return {
            ...image,
            treeCode,
        };
    });
    return t.map((image) => {
        const an = Object.values(
            observable(analysis$).get() || {}
        ).filter((a) => a.imageID === image.imageID)[0];
        const analyzedimage = Object.values(
            observable(analyzedImage$).get() || {}
        ).filter((ai) => ai.analysisID === an.analysisID)[0];
        const diseases = Object.values(
            observable(diseaseIdentified$).get() || {}
        ).filter(
            (d) => d.analysisID === an.analysisID && d.likelihoodScore > 0.5
        );
        
        const base64Image = convertBlobToBase64(image.imageData);
        return {
            ...image,
            imageData: base64Image || "",
            analyzedImage: convertBlobToBase64(analyzedimage.imageData),
            diseases: diseases.map((d) => {
                return {
                    diseaseName: d.diseaseName,
                    likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                };
            }),
        };
    });
}

export function getImageByID(imageID: string) {
    const image = observable(image$)[imageID].get();
    if (!image) return null;

    const tree = observable(tree$)[image.treeID].get();
    if (!tree) return null;

    const analyses = Object.values(observable(analysis$).get() || {}).filter(
        (a) => a.imageID === imageID
    );
    if (!analyses.length) return null;
    const analysis = analyses[0];

    const analyzedImages = Object.values(observable(analyzedImage$).get() || {}).filter(
        (ai) => ai.analysisID === analysis.analysisID
    );
    if (!analyzedImages.length) return null;
    const analyzedImage = analyzedImages[0];

    const diseases = Object.values(observable(diseaseIdentified$).get() || {})
        .filter((d) => d.analysisID === analysis.analysisID)
        .sort((a, b) => b.likelihoodScore - a.likelihoodScore);
    if (!diseases.length) return null;

    const result: ImageAnalysisDetails = {
        ...image,
        ...analysis,
        ...tree,
        diseases: diseases,
        imageData: convertBlobToBase64(image.imageData) || "",
        analyzedImage: convertBlobToBase64(analyzedImage.imageData) || "",
    };

    return result;
}

export function migrateImage(imageID: string, newTreeCode: string): Image | null {
    const image = observable(image$)[imageID].get();
    if (!image) return null;
    
    const tree = Object.values(observable(tree$).get() || {}).filter(
        (a) => a.treeCode === newTreeCode
    );

    const observableImage$ = observable(image$);
    observableImage$[imageID].set({
        ...image,
        treeID: tree[0].treeID,
    });
    return observableImage$[imageID].get() || null;
}

export async function saveScan(scanResult: ScanResult, userID: string) {
    const tree = Object.values(observable(tree$).get() || {}).filter(
        (tree) => tree.userID === userID && tree.treeCode === scanResult.treeCode
    )[0];

    const image = {
        imageID: uuidv4(),
        userID,
        treeID: tree.treeID,
        imageData: convertImageToBlob(scanResult.originalImage),
        status: 1,
        uploadedAt: new Date(),
    };

    const analysis = {
        analysisID: uuidv4(),
        imageID: image.imageID,
        status: 1,
        analyzedAt: new Date(),
    };

    const analyzedImage = {
        analyzedimageID: uuidv4(),
        analysisID: analysis.analysisID,
        imageData: convertImageToBlob(scanResult.analyzedImage),
    };

    observable(image$)[image.imageID].set(image);
    observable(analysis$)[analysis.analysisID].set(analysis);
    observable(analyzedImage$)[analyzedImage.analyzedimageID].set(analyzedImage);

    const diseases = scanResult.diseases as TfJsDisease[];

    diseases.forEach((disease) => {
        const diseaseIdentified = {
            diseaseidentifiedID: uuidv4(),
            analysisID: analysis.analysisID,
            diseaseName: disease.diseaseName,
            diseaseID: null,
            likelihoodScore: disease.likelihoodScore,
        };
        observable(diseaseIdentified$)[diseaseIdentified.diseaseidentifiedID].set(
            diseaseIdentified
        );
    });
}
