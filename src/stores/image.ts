import type { Image, ImageAnalysisDetails, ScanResult } from "@/types/types";
import { createStore } from "./store-config";
import { v4 as uuidv4 } from "uuid";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import { analysis$, analyzedImage$, diseaseIdentified$, tree$ } from "./store";

type images = Image & { analyzedImage: string | null } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export const image$ = createStore<Image>("image");

export function getImageByTreeID(treeID: string): images[] {
    const images = Object.values(observable(image$).get() || {}).filter(
        (image) => image.treeID === treeID
    ) as Image[];
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
                    diseaseName: "Disease Name",
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

export function getImagesByUserID(userID: number) {
    const trees = Object.values(observable(tree$).get() || {}).filter(
        (tree) => tree.userID === userID
    );
    const treeWidthImage = trees.map((tree) => {
        const images = Object.values(observable(image$).get() || {}).filter(
            (image) => image.treeID === tree.treeID
        );
        const recentImage = images.sort(
            (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
        )[0];
        const treeImage = "";
        return {
            ...tree,
            treeImage: "",
            recentImage: recentImage
                ? convertBlobToBase64(recentImage.imageData)
                : null,
            imagesLength: images.length,
        };
    });
    return treeWidthImage;
}

export function getImageByID(imageID: string): ImageAnalysisDetails | null {
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

export async function saveScan(scanResult: ScanResult, userID: number) {
    // Implementation here
}
