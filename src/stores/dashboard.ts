import { convertBlobToBase64 } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import { tree$ } from "./tree";
import { image$ } from "./image";
import { analysis$ } from "./analysis";
import { diseaseidentified$ } from "./diseaseidentified";
import { analyzedimage$ } from "./analyzeimage";
import { getUser } from "./user-store";

const userID = getUser()?.userID;

export async function dashboardMetrics() {
    const trees = Object.values(tree$.get() || {}).filter(t => t.status === 1);
    const images = Object.values(image$.get() || {});
    const i = images.filter((image) => image.userID === userID && image.status === 1);
    const analysis = Object.values(analysis$.get() || {});
    const an = i.map((image) => {
        return analysis.filter((a) => a.imageID === image.imageID)[0];
    });
    const diseaseidentified = Object.values(
        diseaseidentified$.get() || {}
    );
    const di = an.map((a) => {
        return {
            a,
            ...diseaseidentified.filter(
                (d) => d.analysisID === a.analysisID 
            )[0],
        };
    });
    const detectionRate = di.filter((d) => d.diseaseName !== "Healthy")
           .reduce((acc, curr) => acc + (curr.likelihoodScore || 0), 0)/di.length

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
            value: `${detectionRate.toFixed(1)}%`,
            detail: "From all images",
        },
    ];
    return metrics;
}

export async function recentAnalysis() {
    const trees = Object.values(observable(tree$).get() || {}).filter(t => t.status === 1);
    const images = Object.values(observable(image$).get() || {}).filter(i => i.status === 1);
    const i = await Promise.all(images
        .filter((image) => image.userID === userID)
        .map(async (image) => {
            return {
                ...image,
                imageData: await convertBlobToBase64(image.imageData) as string,
            };
        }));

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
            observable(analyzedimage$).get() || {}
        ).filter((ai) => ai.analysisID === an.analysisID)[0];
        const diseases = Object.values(
            observable(diseaseidentified$).get() || {}
        ).filter(
            (d) => d.analysisID === an.analysisID && d.likelihoodScore > 0.5
        );
        return {
            ...image,
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
