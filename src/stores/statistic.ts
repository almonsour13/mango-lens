import { observable } from "@legendapp/state";
import { format } from "date-fns";
import { tree$ } from "./tree";
import { image$ } from "./image";
import { analysis$ } from "./analysis";
import { diseaseidentified$ } from "./diseaseidentified";
import { getUser } from "./user-store";

interface Overview {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    totalImages: number;
    healthyLeaves: number;
    diseasedLeaves: number;
}
const threshold = 30;
const userID = getUser()?.userID

export function overview(): Overview {
    const tree = Object.values(tree$.get() || {}).filter(
        (t) => t.userID === userID && t.status === 1
    );
    const image = Object.values(image$.get() || {}).filter(
        (t) => t.userID === userID  && t.status === 1
    );
    const analysis = Object.values(observable(analysis$).get() || {});
    const diseaseidentified = Object.values(
        observable(diseaseidentified$).get() || {}
    );
    const treeStatus = tree.map((t) => {
        const im = image
            .filter((i) => t.treeID === i.treeID)
            .map((im) => {
                const an = analysis
                    .filter((ans) => ans.imageID === im.imageID)
                    .map((ia) => {
                        const score = diseaseidentified
                            .filter(
                                (di) =>
                                    di.analysisID === ia.analysisID &&
                                    di.diseaseName !== "Healthy"
                            )
                            .reduce(
                                (acc, disease) => acc + disease.likelihoodScore,
                                0
                            );
                        return parseFloat(score.toFixed(1));
                    });
                return { ...im, diseaseScore: an[0] || 0 };
            });
        return { ...t, images: im };
    });

    const healthyTrees = treeStatus.filter((t) =>
        t.images.every((img:any) => img.diseaseScore < threshold)
    ).length;
    const diseasedTrees = treeStatus.filter((t) =>
        t.images.some((img:any) => img.diseaseScore >= threshold)
    ).length;

    const imageStatus = image.map((img) => {
        const an = analysis
            .filter((ans) => ans.imageID === img.imageID)
            .map((ia) => {
                const score = diseaseidentified
                    .filter(
                        (di) =>
                            di.analysisID === ia.analysisID &&
                            di.diseaseName !== "Healthy"
                            && di.status === 1
                    )
                    .reduce((acc, disease) => acc + disease.likelihoodScore, 0);
                return parseFloat(score.toFixed(1));
            });
        return { diseaseScore: an[0] || 0 };
    });
    const healthyLeaves = imageStatus.filter(
        (img) => img.diseaseScore < threshold
    ).length;
    const diseasedLeaves = imageStatus.filter(
        (img) => img.diseaseScore >= threshold
    ).length;

    const overview = {
        totalTrees: tree.length,
        healthyTrees,
        diseasedTrees,
        totalImages: image.length,
        healthyLeaves,
        diseasedLeaves,
    };

    return overview;
}
function generateMonthlyRange(from: string, to: string) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const months: { year: number; month: number }[] = [];

    while (startDate <= endDate) {
        months.push({
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
        });
        startDate.setMonth(startDate.getMonth() + 1); // Increment month
    }

    return months;
}
export function treeStatistic(from: string, to: string, userID: string) {
    const tree = Object.values(observable(tree$).get() || {}).filter(
        (t) => t.userID === userID 
    );
    const monthlyRange = generateMonthlyRange(from, to);
    const mergedData = monthlyRange.map((month) => {
        const match = tree.filter(
            (t) =>
                new Date(t.addedAt).getFullYear() === month.year &&
                new Date(t.addedAt).getMonth() + 1 === month.month
        );
        return {
            year: month.year,
            month: month.month,
            treeCount: match ? match.length : 0, 
        };
    });
    return mergedData;
}
export function imageStatistic(from: string, to: string, userID: string) {
    const image = Object.values(observable(image$).get() || {}).filter(
        (t) => t.userID === userID
    );

    const monthlyRange = generateMonthlyRange(from, to);
    const analysis = Object.values(observable(analysis$).get() || {});
    const diseaseidentified = Object.values(
        diseaseidentified$.get() || {}
    );
    const mergedData = monthlyRange.map((month) => {
        const match = image.filter(
            (i) =>
                new Date(i.uploadedAt).getFullYear() === month.year &&
                new Date(i.uploadedAt).getMonth() + 1 === month.month
        );

        const im = match.map((img) => {
            const an = analysis
                .filter((ans) => ans.imageID === img.imageID)
                .map((ia) => {
                    const score = diseaseidentified
                        .filter(
                            (di:any) =>
                                di.analysisID === ia.analysisID &&
                                di.diseaseName !== "Healthy"
                        )
                        .reduce(
                            (acc:number, disease:any) => acc + disease.likelihoodScore,
                            0
                        );
                    return parseFloat(score.toFixed(1));
                });
            return { diseaseScore: an[0] || 0 };
        });
        const healthyLeaves = im.filter(
            (img) => img.diseaseScore < threshold
        ).length;
        const diseasedLeaves = im.filter(
            (img) => img.diseaseScore >= threshold
        ).length;
        return{
            ...month,
            healthyCount: healthyLeaves,
            diseasedCount: diseasedLeaves
        }
    });
    return mergedData
}
