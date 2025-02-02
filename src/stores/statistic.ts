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
const userID = getUser()?.userID;

export async function overview(): Promise<Overview> {
    const trees = Object.values(tree$.get() || {}).filter(
        (t) => t.userID === userID && t.status === 1
    );
    const images = Object.values(image$.get() || {}).filter(
        (t) => t.userID === userID && t.status === 1
    );

    const analysis = Object.values(observable(analysis$).get() || {});
    const diseaseidentified = Object.values(
        observable(diseaseidentified$).get() || {}
    );

    const diseasedImages = images.map((img) => {
        const an = analysis.filter((a) => a.imageID === img.imageID)[0];
        const di = diseaseidentified.filter(
            (d) => d.analysisID === an.analysisID
        );
        const checkHealthyClass = di.filter((d) => d.diseaseName === "Healthy")
        .reduce((acc, disease) => acc + disease.likelihoodScore, 0);;
        const checkDiseasedClass = di
            .filter((d) => d.diseaseName !== "Healthy")
            .reduce((acc, disease) => acc + disease.likelihoodScore, 0);
        return{
            ...img,
            isHealthy:checkHealthyClass > checkDiseasedClass
        }
    });

    const diseaseTree = trees.map( t => {
        const img = diseasedImages.filter( i => i.treeID === t.treeID)
        return{
            isHealthy:img.filter(i => i.isHealthy === true).length > 0
        }
    })

    const overview = {
        totalTrees: trees.length,
        healthyTrees:diseaseTree.filter(dt => dt.isHealthy === true).length,
        diseasedTrees:diseaseTree.filter(dt => dt.isHealthy === false).length,
        totalImages: images.length,
        healthyLeaves:diseasedImages.filter(di => di.isHealthy === true).length,
        diseasedLeaves:diseasedImages.filter(di => di.isHealthy === false).length,
    };

    return overview;
}
export function generateMonthlyRange(from: string, to: string) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const months: { year: number; month: number; day?:number }[] = [];

    while (startDate <= endDate) {
        months.push({
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getMonth() + 1,
        });
        startDate.setMonth(startDate.getMonth() + 1); // Increment month
    }

    return months;
}
export function treeStatistic(from: string, to: string) {
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
export function imageStatistic(from: string, to: string) {
    const images = Object.values(image$.get() || {}).filter(
        (t) => t.userID === userID && t.status === 1
    );

    const monthlyRange = generateMonthlyRange(from, to);
    const analysis = Object.values(observable(analysis$).get() || {});
    const diseaseidentified = Object.values(diseaseidentified$.get() || {});
    const mergedData = monthlyRange.map((month) => {
        const match = images.filter(
            (i) =>
                new Date(i.uploadedAt).getFullYear() === month.year &&
                new Date(i.uploadedAt).getMonth() + 1 === month.month
        );

        const diseasedImages = match.map((img) => {
            const an = analysis.filter((a) => a.imageID === img.imageID)[0];
            const di = diseaseidentified.filter(
                (d) => d.analysisID === an.analysisID
            );
            const checkHealthyClass = di.filter((d) => d.diseaseName === "Healthy")
            .reduce((acc, disease) => acc + disease.likelihoodScore, 0);;
            const checkDiseasedClass = di
                .filter((d) => d.diseaseName !== "Healthy")
            return{
                
            ...img,
            isHealthy:checkHealthyClass > checkDiseasedClass
            }
        });

        return {
            ...month,
            healthyCount:diseasedImages.filter(di => di.isHealthy === true).length,
            diseasedCount:diseasedImages.filter(di => di.isHealthy === false).length,
        };
    });
    return mergedData;
}
