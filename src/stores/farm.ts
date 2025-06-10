import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { supabase } from "@/supabase/supabase";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { loadingStore$ } from "./loading-store";
import { data } from "@tensorflow/tfjs";
import { tree$ } from "./tree";
import { tree } from "next/dist/build/templates/app-page";
import { image$ } from "./image";
import { analysis$ } from "./analysis";
import { diseaseidentified$ } from "./diseaseidentified";

const userID = getUser()?.userID;

export const farm$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.farm.set(true);
                const { data, error } = await supabase
                    .from("farm")
                    .select("*")
                    .eq("userID", userID);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching farms:`, error);
                throw error;
            } finally {
                loadingStore$.farm.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("farm")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating farm:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required for update");
                }

                const { data, error } = await supabase
                    .from("farm")
                    .update(value)
                    .eq("id", value.id)
                    .eq("userID", userID)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating farm:`, error);
                throw error;
            }
        },
        persist: {
            name: "farm",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);

export const addFarm = async (
    farmName: string,
    address: string,
    description?: string
): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const farmID = uuidv4();
        const newFarm: any = {
            farmID,
            userID: userID,
            farmName,
            address,
            description,
            status: 1,
            addedAt: new Date(),
        };
        farm$[farmID].set(newFarm);
        return {
            success: true,
            data: newFarm,
            message: "Farm updated successfully.",
        };
    } catch (error) {
        console.error("Error adding farm:", error);
        return {
            success: false,
            message: "Failed to add farm. Please try again.",
            data: [],
        };
    }
};
export const updateFarm = async (
    farmID: string,
    farmName: string,
    address: string,
    status: number,
    description?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const farm = farm$[farmID].get();
        if (!farm) {
            return { success: false, message: "Farm not found." };
        }
        const updatedFarm = {
            ...farm,
            farmName,
            address,
            description,
            updatedAt: new Date(),
            status: status,
        };
        console.log("Updating farm:", updatedFarm);
        farm$[farmID].set(updatedFarm);

        return { success: true, message: "Farm updated successfully." };
    } catch (error) {
        console.error("Error updating farm:", error);
        return {
            success: false,
            message: "Failed to update farm. Please try again.",
        };
    }
};
export const getFarmByUser = async (): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
}> => {
    if (!userID) return { success: false, message: "User not found." };

    try {
        const farms = Object.values(farm$.get() || {});
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const diseaseidentified = Object.values(diseaseidentified$.get() || {});

        const updatedFarms = farms.map((farm) => {
            // Filter trees for this farm with active status
            const farmTrees = trees.filter(
                (tree) => tree.farmID === farm.farmID && tree.status === 1
            );

            const healthyTrees: any[] = [];
            const diseasedTrees: any[] = [];
            const diseaseCount: { [key: string]: number } = {};

            farmTrees.forEach((tree) => {
                try {
                    // Get ALL images for this tree (not just recent)
                    const treeImages = images.filter(
                        (img) => img.treeID === tree.treeID && img.status === 1
                    );

                    if (treeImages.length === 0) {
                        console.log(`No images found for tree ${tree.treeID}`);
                        return;
                    }

                    console.log(
                        `Found ${treeImages.length} images for tree ${tree.treeID}`
                    );

                    // Process ALL images for disease counting
                    let treeHealthyCount = 0;
                    let treeDiseasedCount = 0;
                    const image: any = Object.values(image$.get() || {})
                        .filter((img) => img.treeID === tree.treeID)
                        .sort(
                            (a, b) =>
                                new Date(b.uploadedAt).getTime() -
                                new Date(a.uploadedAt).getTime()
                        )[0];
                    const analysis = Object.values(analysis$.get() || {}).find(
                        (an) => an.imageID === image.imageID
                    );

                    // Skip if no analysis found for this image
                    if (!analysis) {
                        console.log(
                            `No analysis found for image ${image.imageID}`
                        );
                        return;
                    }

                    // Find disease identification for this analysis
                    const diseaseIdentified = Object.values(
                        diseaseidentified$.get() || {}
                    ).find((di) => di.analysisID === analysis.analysisID);

                    // Categorize tree based on most recent disease identification
                    // but count all disease occurrences in diseaseCount
                    if (diseaseCount[diseaseIdentified.diseaseName]) {
                        diseaseCount[diseaseIdentified.diseaseName]++;
                    } else {
                        diseaseCount[diseaseIdentified.diseaseName] = 1;
                    }

                    // Track counts for this specific tree
                    if (
                        diseaseIdentified.diseaseName.toLowerCase() ===
                        "healthy"
                    ) {
                        treeHealthyCount++;
                    } else {
                        treeDiseasedCount++;
                    }
                    if (diseaseIdentified) {
                        if (
                            diseaseIdentified.diseaseName.toLowerCase() ===
                            "healthy"
                        ) {
                            healthyTrees.push({
                                treeID: tree.treeID,
                                ...diseaseIdentified,
                                totalImages: treeImages.length,
                                healthyImages: treeHealthyCount,
                                diseasedImages: treeDiseasedCount,
                            });
                        } else {
                            diseasedTrees.push({
                                treeID: tree.treeID,
                                ...diseaseIdentified,
                                totalImages: treeImages.length,
                                healthyImages: treeHealthyCount,
                                diseasedImages: treeDiseasedCount,
                            });
                        }
                    }
                } catch (error) {
                    console.error(
                        `Error processing tree ${tree.treeID}:`,
                        error
                    );
                }
            });

            // Calculate farm health percentage
            const totalProcessedTrees =
                healthyTrees.length + diseasedTrees.length;
            const farmHealthPercentage =
                totalProcessedTrees > 0
                    ? (
                          (healthyTrees.length / totalProcessedTrees) *
                          100
                      ).toFixed(1)
                    : "0";
            console.log("Disease count:", diseaseCount);
            return {
                ...farm,
                totalTrees: farmTrees.length,
                processedTrees: totalProcessedTrees,
                healthyTrees: healthyTrees.length,
                diseasedTrees: diseasedTrees.length,
                diseaseCount: diseaseCount,
                farmHealth: farmHealthPercentage,
            };
        });

        // Filter out farms that belong to the current user
        const userFarms = updatedFarms.filter((farm) => farm.userID === userID);

        return {
            success: true,
            data: userFarms,
            message: "Farms fetched successfully.",
        };
    } catch (error) {
        console.error(`Error fetching farms for user ${userID}:`, error);
        return { success: false, message: "Failed to fetch farms." };
    }
};
export const getFarmByID = async (farmID: string): Promise<any> => {
    if (!farmID) throw new Error("Farm ID is required.");
    try {
        const farm = farm$[farmID].get();
        if (!farm) throw new Error(`Farm with ID ${farmID} not found.`);
        const trees = Object.values(tree$.get() || {}).filter(
            (tree) => tree.farmID === farmID
        );
        console.log(trees);
        const healthyTrees: any[] = [];
        const diseasedTrees: any[] = [];
        const diseaseCount: { [key: string]: number } = {};

        trees.forEach((tree) => {
            // Get the most recent image for this tree
            const image: any = Object.values(image$.get() || {})
                .filter((img) => img.treeID === tree.treeID)
                .sort(
                    (a, b) =>
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                )[0];

            // Skip if no image found for this tree
            if (!image) {
                console.log(`No image found for tree ${tree.treeID}`);
                return;
            }

            // Find analysis for this image
            const analysis = Object.values(analysis$.get() || {}).find(
                (an) => an.imageID === image.imageID
            );

            // Skip if no analysis found for this image
            if (!analysis) {
                console.log(`No analysis found for image ${image.imageID}`);
                return;
            }

            // Find disease identification for this analysis
            const diseaseIdentified = Object.values(
                diseaseidentified$.get() || {}
            ).find((di) => di.analysisID === analysis.analysisID);

            // Skip if no disease identification found
            if (!diseaseIdentified) {
                console.log(
                    `No disease identification found for analysis ${analysis.analysisID}`
                );
                return;
            }
            if (diseaseCount[diseaseIdentified.diseaseName]) {
                diseaseCount[diseaseIdentified.diseaseName]++;
            } else {
                diseaseCount[diseaseIdentified.diseaseName] = 1;
            }

            // Categorize tree based on disease identification
            if (diseaseIdentified.diseaseName === "Healthy") {
                healthyTrees.push({
                    treeID: tree.treeID,
                    ...diseaseIdentified,
                });
            } else {
                diseasedTrees.push({
                    treeID: tree.treeID,
                    ...diseaseIdentified,
                });
            }
        });

        return {
            data: {
                ...farm,
                totalTrees: trees.length,
                healthyTrees: healthyTrees.length,
                diseasedTrees: diseasedTrees.length,
                diseaseCount: diseaseCount,
                farmHealth:
                    trees.length > 0
                        ? ((healthyTrees.length / trees.length) * 100).toFixed(
                              1
                          )
                        : "0",
            },
            success: true,
            message: "Farm fetched successfully.",
        };
    } catch (error) {
        console.error(`Error fetching farm by ID ${farmID}:`, error);
        throw error;
    }
};
