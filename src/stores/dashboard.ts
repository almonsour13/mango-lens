import { convertBlobToBase64 } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import {
    analysis$,
    analyzedImage$,
    diseaseIdentified$,
    image$,
    tree$,
} from "./stores";

export async function dashboardMetrics(userID: string) {
    const trees = Object.values(observable(tree$).get() || {});
    const images = Object.values(observable(image$).get() || {});
    const i = images.filter((image) => image.userID === userID);
    const analysis = Object.values(observable(analysis$).get() || {});
    const an = i.map((image) => {
        return analysis.filter((a) => a.imageID === image.imageID)[0];
    });
    const diseaseidentified = Object.values(
        observable(diseaseIdentified$).get() || {}
    );
    const di = an.map((a) => {
        return {
            a,
            diseaseidentified: diseaseidentified.filter(
                (d) => d.analysisID === a.analysisID
            )[0],
        };
    });
    const detectionRate =
        images.length > 0 ? (di.length / images.length) * 100 : 0;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const thisMonthTrees = trees.filter(
        (tree) => new Date(tree.addedAt) >= firstDayOfMonth
    ).length;
    const thisMonthImages = images.filter(
        (image) => new Date(image.uploadedAt) >= firstDayOfMonth
    ).length;
    const thisMonthDiseases = di.filter(
        (disease) => new Date(disease.a.analyzedAt) >= firstDayOfMonth
    ).length;
    const metrics = [
        {
            name: "Total Trees",
            value: trees.length,
            detail: `+${thisMonthTrees} this month`,
        },
        {
            name: "Total Images",
            value: images.length,
            detail: `+${thisMonthImages} this month`,
        },
        {
            name: "Disease Detected",
            value: di.length,
            detail: `+${thisMonthDiseases} this month`,
        },
        {
            name: "Detection Rate",
            value: `${detectionRate}%`,
            detail: "From all images",
        },
    ];
    return metrics;
}

export function recentAnalysis(userID: string) {
    const trees = Object.values(observable(tree$).get() || {});
    const images = Object.values(observable(image$).get() || {});
    const i = images
        .map((image) => {
            return {
                ...image,
                imageData: convertBlobToBase64(image.imageData) as string,
            };
        })
        .filter((image) => image.userID === userID);

    const t = i.map((image) => {
        const treeCode = trees.filter((t) => t.treeID === image.treeID)[0]
            .treeCode;
        return {
            ...image,
            treeCode,
        };
    });

    const analysis = Object.values(observable(analysis$).get() || {});
    const f = t.map((image) => {
        const an = analysis.filter((a) => a.imageID === image.imageID)[0];
        const analyzedimage = Object.values(
            observable(analyzedImage$).get() || {}
        ).filter((ai) => ai.analysisID === an.analysisID)[0];
        const diseases = Object.values(
            observable(diseaseIdentified$).get() || {}
        ).filter(
            (d) => d.analysisID === an.analysisID && d.likelihoodScore > 0.5
        );
        return {
            ...image,
            analyzedImage: convertBlobToBase64(analyzedimage.imageData),
            diseases: diseases.map((d) => {
                return {
                    diseaseName: d.diseaseName,
                    likelihoodScore: d.likelihoodScore,
                };
            }),
        };
    });
    return f;
}
