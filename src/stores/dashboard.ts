import { convertBlobToBase64 } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import { tree$ } from "./tree";
import { image$ } from "./image";
import { analysis$ } from "./analysis";
import { diseaseidentified$ } from "./diseaseidentified";
import { analyzedimage$ } from "./analyzeimage";
import { getUser } from "./user-store";
import { farm$ } from "./farm";

const userID = getUser()?.userID;

export async function dashboardMetrics() {
    const farms = Object.values(farm$.get() || {});
    const trees = Object.values(tree$.get() || {});
    const images = Object.values(image$.get() || {}); // Fixed: should be image$ not tree$

    const totalFarms = farms.filter(
        (farm) => farm.userID === userID && farm.status !== 3
    );
    const totalTrees = trees.filter(
        (tree) => tree.userID === userID && tree.status !== 3
    ); // Fixed: parameter name
    const totalImages = images.filter(
        (image) => image.userID === userID && image.status !== 3
    ); // Fixed: using images array and parameter name

    // Calculate this month's additions (you'll need to implement the logic based on your data structure)
    const thisMonth = new Date();
    thisMonth.setDate(1); // First day of current month

    const thisMonthFarms = farms.filter(
        (farm) =>
            farm.userID === userID &&
            farm.status !== 3 &&
            new Date(farm.addedAt) >= thisMonth
    ).length;

    const thisMonthTrees = trees.filter(
        (tree) =>
            tree.userID === userID &&
            tree.status !== 3 &&
            new Date(tree.addedAt) >= thisMonth
    ).length;

    const thisMonthImages = images.filter(
        (image) =>
            image.userID === userID &&
            image.status !== 3 &&
            new Date(image.uploadedAt) >= thisMonth
    ).length;

    const metrics = [
        {
            name: "Total Farms",
            value: totalFarms.length, // Fixed: get the count, not the array
            detail: `+${thisMonthFarms} this month`,
        },
        {
            name: "Total Trees",
            value: totalTrees.length, // Fixed: get the count, not the array
            detail: `+${thisMonthTrees} this month`, // Fixed: use correct variable
        },
        {
            name: "Total Images",
            value: totalImages.length, // Fixed: get the count, not the array
            detail: `+${thisMonthImages} this month`, // Fixed: use correct variable
        },
    ];

    return metrics;
}
export async function recentAnalysis() {
    // const trees = Object.values(observable(tree$).get() || {}).filter(
    //     (t) => t.status === 1
    // );
    // const images = Object.values(observable(image$).get() || {}).filter(
    //     (i) => i.status === 1
    // );
    // const i = await Promise.all(
    //     images
    //         .filter((image) => image.userID === userID && image.status === 1)
    //         .slice(0, 5)
    //         .map(async (image) => {
    //             return {
    //                 ...image,
    //                 imageData: (await convertBlobToBase64(
    //                     image.imageData
    //                 )) as string,
    //             };
    //         })
    // );

    // const t = i.map((image) => {
    //     const treeCode = trees.filter(
    //         (t) => t.treeID === image.treeID && t.status === 1
    //     )[0];
    //     if (treeCode && treeCode.status === 1) {
    //         return {
    //             ...image,
    //             treeCode: treeCode ? treeCode.treeCode : null,
    //         };
    //     }
    // });

    // const analysis = Object.values(observable(analysis$).get() || {});
    // const f = t.map((image) => {
    //     const an = analysis.filter((a) => a.imageID === image.imageID)[0];
    //     if(an){
    //     const analyzedimage = Object.values(
    //         observable(analyzedimage$).get() || {}
    //     ).filter((ai) => ai.analysisID === an.analysisID)[0];
    //     const diseases = Object.values(
    //         observable(diseaseidentified$).get() || {}
    //     ).filter(
    //         (d) => d.analysisID === an.analysisID && d.likelihoodScore > 0.5
    //     );
    //     return {
    //         ...image,
    //         analyzedImage: convertBlobToBase64(analyzedimage.imageData),
    //         diseases: diseases.map((d) => {
    //             return {
    //                 diseaseName: d.diseaseName,
    //                 likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
    //             };
    //         }),

    //     };
    // }
    // });
    try {
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const analyzedImages = Object.values(analyzedimage$.get() || {});
        const identifiedDiseases = Object.values(
            diseaseidentified$.get() || {}
        );

        // Filter images by userID first
        const userImages = images
            .filter((image) => image.userID === userID && image.status === 1)
            .sort(
                (a, b) =>
                    new Date(b.uploadedAt).getTime() -
                    new Date(a.uploadedAt).getTime()
            );

        if (userImages.length === 0) {
            return {
                success: false,
                message: "No images found for this user.",
            };
        }

        // Map additional details for each image
        const detailedImages = userImages.map((image) => {
            const tree = trees.find((t) => t.treeID === image.treeID);
            const analysisEntry = analysis.find(
                (a) => a.imageID === image.imageID
            );
            const analyzedImage = analyzedImages.find(
                (ai) => ai.analysisID === analysisEntry?.analysisID
            );
            const diseases = identifiedDiseases.filter(
                (d) => d.analysisID === analysisEntry?.analysisID
            );
            if (tree.status === 1 && image.status === 1) {
                return {
                    ...image,
                    treeCode: tree?.treeCode || "Unknown",
                    imageData: convertBlobToBase64(image.imageData) || null,
                    analyzedImage:
                        convertBlobToBase64(analyzedImage?.imageData) || null,
                    diseases: diseases.map((d) => ({
                        diseaseName: d.diseaseName,
                        likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                    })),
                };
            }
        });
        return { success: true, data: detailedImages };
    } catch (error) {
        console.error("Error fetching images by user:", error);
        return {
            success: false,
            message: "An error occurred while fetching images.",
        };
    }
}
