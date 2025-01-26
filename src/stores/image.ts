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
    const treeImages = images.map((image) => {
        const analysis = Object.values(
            observable(analysis$).get() || {}
        ).filter((analysis) => analysis.imageID === image.imageID)[0];

        const analyzedImage = Object.values(
            observable(analyzedImage$).get() || {}
        ).filter(
            (analyzedImage) => analyzedImage.analysisID === analysis?.analysisID
        )[0];
        const diseases = Object.values(
            observable(diseaseIdentified$).get() || {}
        )
            .filter((disease) => disease.analysisID === analysis?.analysisID)
            .map((diseaseIdentified) => {
                return {
                    likelihoodScore: diseaseIdentified.likelihoodScore,
                    diseaseName: diseaseIdentified.diseaseName,
                };
            });
        const base64Image = convertBlobToBase64(image.imageData);
        const base64AnalyzedImage = analyzedImage?.imageData
            ? convertBlobToBase64(analyzedImage.imageData)
            : "";
        return {
            ...image,
            imageData: base64Image || "",
            analyzedImage: base64AnalyzedImage,
            diseases,
        };
    });
    return treeImages;
}
export function getImagesByUserID(userID: string) {
    const images = Object.values(image$.get() || {}).filter(
        (image) => image.userID == userID
    );
    return images.map((image) => {
        const analysis = Object.values(analysis$.get() || {}).filter(
            (analysis) => analysis.imageID === image.imageID
        )[0];

        const analyzedImage = Object.values(analyzedImage$.get() || {}).filter(
            (analyzedImage) => analyzedImage.analysisID === analysis?.analysisID
        )[0];
        const diseases = Object.values(diseaseIdentified$.get() || {})
            .filter((disease) => disease.analysisID === analysis?.analysisID)
            .map((diseaseIdentified) => {
                return {
                    likelihoodScore: diseaseIdentified.likelihoodScore,
                    diseaseName: "Disease Name",
                };
            });
        const base64Image = convertBlobToBase64(image.imageData);
        const base64AnalyzedImage = analyzedImage?.imageData
            ? convertBlobToBase64(analyzedImage.imageData)
            : "";
        return {
            ...image,
            imageData: base64Image,
            analyzedImage: base64AnalyzedImage,
            diseases,
        };
    });
}
export function getImageByID(imageID: string) {
    // Get the image
    const image = image$[imageID].get();
    if (!image) return null;

    const tree = tree$[image.treeID].get();
    if (!tree) return null;

    const analyses = Object.values(analysis$.get() || {}).filter(
        (a) => a.imageID === imageID
    );
    if (!analyses.length) return null;
    const analysis = analyses[0];

    const analyzedImages = Object.values(analyzedImage$.get() || {}).filter(
        (ai) => ai.analysisID === analysis.analysisID
    );
    if (!analyzedImages.length) return null;
    const analyzedImage = analyzedImages[0];

    const diseases = Object.values(diseaseIdentified$.get() || {})
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
export function migrateImage(
    imageID: string,
    newTreeCode: string
): Image | null {
    const image = image$[imageID].get();
    if (!image) return null;
    const tree = Object.values(tree$.get() || {}).filter(
        (a) => a.treeCode === newTreeCode
    );

    image$[imageID].set({
        ...image,
        treeID: tree[0].treeID,
    });
    return image$[imageID].get() || null;
}
export async function saveScan(scanResult: ScanResult, userID: string) {
    const tree = Object.values(tree$.get() || {}).filter(
        (tree) =>
            tree.userID === userID && tree.treeCode === scanResult.treeCode
    )[0];
    const image = {
        imageID: uuidv4(),
        userID,
        treeID: tree.treeID,
        imageData: convertImageToBlob(scanResult.originalImage),
        status: 1,
        uploadedAt: new Date(),
    };
    console.log(image.imageData)
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

    image$[image.imageID].set(image);
    analysis$[analysis.analysisID].set(analysis);
    analyzedImage$[analyzedImage.analyzedimageID].set(analyzedImage);

    const diseases = scanResult.diseases as TfJsDisease[];

    diseases.forEach((disease) => {
        const diseaseIdentified = {
            diseaseidentifiedID: uuidv4(),
            analysisID: analysis.analysisID,
            diseaseName: disease.diseaseName,
            diseaseID: null,
            likelihoodScore: disease.likelihoodScore,
        };
        diseaseIdentified$[diseaseIdentified.diseaseidentifiedID].set(
            diseaseIdentified
        );
    });
}
