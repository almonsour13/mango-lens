import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { supabase } from "@/supabase/supabase";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { checkTreeCode } from "@/utils/tree-utils";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { image$ } from "./image";
import { treeimage$ } from "./treeimage";
import { farm$ } from "./farm";
import { loadingStore$ } from "./loading-store";
import { analysis$ } from "./analysis";
import { diseaseidentified$ } from "./diseaseidentified";

const userID = getUser()?.userID;

export const tree$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.tree.set(true);
                const { data, error } = await supabase
                    .from("tree")
                    .select("*")
                    .neq("status", 4)
                    .eq("userID", userID);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching predictions:`, error);
                throw error;
            } finally {
                loadingStore$.tree.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("tree")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating prediction:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("pred_id is required for update");
                }

                const { data, error } = await supabase
                    .from("tree")
                    .update(value)
                    .eq("id", value.id)
                    .eq("userID", userID)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating prediction:`, error);
                throw error;
            }
        },
        persist: {
            name: "tree",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);

export const getTreeByUser = async (): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
}> => {
    if (!userID) return { success: false, message: "User not found." };

    try {
        const farms = Object.values(farm$.get() || {});
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const treesimage = Object.values(treeimage$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const diseaseidentified = Object.values(diseaseidentified$.get() || {});

        const userTrees = trees.filter((tree) => tree.status === 1);

        if (userTrees.length === 0) {
            return { success: false, message: "No trees found for this user." };
        }

        // Process trees with their images
        const treeWithImage = await Promise.all(
            userTrees.map(async (tree) => {
                try {
                    // Get related images for this tree
                    const relatedImages = images.filter(
                        (image) =>
                            image.treeID === tree.treeID && image.status === 1
                    );
                    console.log(relatedImages);

                    const farm = farms.find(
                        (farm) => farm.farmID === tree.farmID && farm.status === 1
                    );

                    // Get the most recent image
                    const recentImage = relatedImages.sort(
                        (a, b) =>
                            new Date(b.uploadedAt).getTime() -
                            new Date(a.uploadedAt).getTime()
                    )[0];

                    // Initialize analysis and disease identification variables
                    let an:any = null;
                    let diseaseIdentified = null;

                    // Only proceed if we have a recent image
                    if (recentImage) {
                        an = analysis.find(
                            (an) => an.analysisID && recentImage.imageID && 
                                   an.imageID === recentImage.imageID
                        );

                        // Only look for disease identification if analysis exists
                        if (an && an.analysisID) {
                            diseaseIdentified = diseaseidentified.find(
                                (di) => di.analysisID === an.analysisID
                            );
                        }
                    }

                    console.log(diseaseIdentified);

                    // Get tree image
                    const treeimage = treesimage.find(
                        (treeimage) =>
                            treeimage.treeID === tree.treeID &&
                            treeimage.status === 1
                    );

                    // Convert images to base64 if they exist
                    let treeImageBase64 = null;
                    let recentImageBase64 = null;

                    try {
                        if (treeimage?.imageData) {
                            treeImageBase64 = await convertBlobToBase64(
                                treeimage.imageData
                            );
                        }

                        if (recentImage?.imageData) {
                            recentImageBase64 = await convertBlobToBase64(
                                recentImage.imageData
                            );
                        }
                    } catch (error) {
                        console.error("Error converting image to base64:", error);
                        // Continue processing even if image conversion fails
                    }

                    return {
                        ...tree,
                        farmName: farm?.farmName || 'Unknown Farm',
                        treeImage: treeImageBase64,
                        recentImage: recentImage ? {
                            imageData: recentImageBase64,
                            diseaseName: diseaseIdentified?.diseaseName || null,
                            likelihoodScore: diseaseIdentified?.likelihoodScore || null
                        } : null,
                        imagesLength: relatedImages.length,
                    };
                } catch (error) {
                    console.error(`Error processing tree ${tree.treeID}:`, error);
                    // Return tree with minimal data if processing fails
                    return {
                        ...tree,
                        farmName: 'Unknown Farm',
                        treeImage: null,
                        recentImage: null,
                        imagesLength: 0,
                    };
                }
            })
        );
        
        return { success: true, data: treeWithImage };
    } catch (error) {
        console.error("Error fetching trees by user:", error);
        return {
            success: false,
            message: "An error occurred while fetching trees.",
        };
    }
};
export const getTreeByID = async (treeID: string) => {
    const tree = tree$[treeID]?.get();
    const treesimage = Object.values(treeimage$.get() || {});
    const images = Object.values(image$.get() || {});
    const farm = Object.values(farm$.get() || {});
    if (!tree || tree.status !== 1) {
        return null;
    }
    const farmName =
        farm.find((farm) => farm.farmID === tree.farmID && farm.status === 1)
            ?.farmName || "Unknown Farm";
    const treeimage = treesimage.filter(
        (treeimage) =>
            treeimage.treeID === tree.treeID && treeimage.status === 1
    )[0];
    const relatedImages = images.filter(
        (image) => image.treeID === tree.treeID && image.status === 1
    );
    return {
        ...tree,
        farmName,
        treeImage: treeimage ? convertBlobToBase64(treeimage.imageData) : null,
        imagesLength: relatedImages.length,
    };
};
export const updateTreeByID = async (
    treeID: string,
    treeCode: string,
    description: string,
    status: number,
    treeImage?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const trees = tree$.get() || {}; // Get all trees

        if (!trees[treeID]) {
            return { success: false, message: "Tree not found." };
        }

        if (
            Object.values(trees).some(
                (t) => t.treeCode === treeCode && t.treeID !== treeID
            )
        ) {
            return { success: false, message: "Tree code already exists." };
        }
        tree$[treeID].set({
            treeCode,
            description,
            status: status,
            updatedAt: new Date(),
        });
        if (treeImage) {
            const treeImageID = uuidv4();

            const hasTreeImage = treeimage$[treeImageID].get();
            if (hasTreeImage) {
                treeimage$[treeImageID].set({
                    status: 2,
                });
            }
            treeimage$[treeImageID].set({
                treeImageID,
                treeID,
                imageData: convertImageToBlob(treeImage),
                status: 1,
                addedAt: new Date(),
            });
        }

        return { success: true, message: "Tree updated successfully." };
    } catch (error) {
        console.error("Error updating tree:", error);
        return {
            success: false,
            message: "An error occurred while updating the tree.",
        };
    }
};
export const addTree = async (
    farmID: string,
    treeCode: string,
    description: string,
    treeImage?: string
): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const treeID = uuidv4();

        const treeData = {
            treeID,
            userID,
            farmID,
            treeCode,
            description,
            status: 1,
            addedAt: new Date(),
        };
        tree$[treeID].set(treeData);
        if (treeImage) {
            const treeImageID = uuidv4();

            const hasTreeImage = treeimage$[treeImageID].get();
            if (hasTreeImage) {
                treeimage$[treeImageID].set({
                    status: 2,
                });
            }
            treeimage$[treeImageID].set({
                treeImageID,
                treeID,
                imageData: convertImageToBlob(treeImage),
                status: 1,
                addedAt: new Date(),
            });
        }

        return {
            success: true,
            message: "Tree added successfully.",
            data: treeData,
        };
    } catch (error) {
        console.error("Error adding tree:", error);
        return {
            success: false,
            message: "An error occurred while adding the tree.",
        };
    }
};
export const generateTreeCode = async (farmID: string | null) => {
    try {
        const trees = Object.values(tree$.get() || {});
        if (trees.length === 0) return "TR001";

        const lastTree = trees
            .filter((tree) => tree.farmID === farmID)
            .sort((a, b) => b.addedAt - a.addedAt)[0];
        if (!lastTree) return "TR001";

        const lastCode = lastTree.treeCode;
        const codeNumber = parseInt(lastCode.replace("TR", ""));
        const newCodeNumber = codeNumber + 1;
        return `TR${newCodeNumber.toString().padStart(3, "0")}`;
    } catch (error) {
        console.error("Error checking last tree code:", error);
        return "TR001"; // Fallback in case of error
    }
};
export const getTreesByFarmID = async (
    farmID: string
): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
}> => {
    // Validate input parameter
    if (!farmID || farmID.trim() === '') {
        return { success: false, message: "Farm ID is required." };
    }

    try {
        const farms = Object.values(farm$.get() || {});
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const treesimage = Object.values(treeimage$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const diseaseidentified = Object.values(diseaseidentified$.get() || {});

        // Filter trees by the specific farmID and active status
        const farmTrees = trees.filter((tree) => 
            tree.farmID === farmID && tree.status === 1
        );

        if (farmTrees.length === 0) {
            return { success: false, message: "No trees found for this farm." };
        }

        // Find the farm details for the given farmID
        const farm = farms.find(
            (farm) => farm.farmID === farmID && farm.status === 1
        );

        // Process trees with their images
        const treeWithImage = await Promise.all(
            farmTrees.map(async (tree) => {
                try {
                    // Get related images for this tree
                    const relatedImages = images.filter(
                        (image) =>
                            image.treeID === tree.treeID && image.status === 1
                    );
                    console.log(relatedImages);

                    // Get the most recent image
                    const recentImage = relatedImages.sort(
                        (a, b) =>
                            new Date(b.uploadedAt).getTime() -
                            new Date(a.uploadedAt).getTime()
                    )[0];

                    // Initialize analysis and disease identification variables
                    let an:any = null;
                    let diseaseIdentified = null;

                    // Only proceed if we have a recent image
                    if (recentImage) {
                        an = analysis.find(
                            (an) => an.analysisID && recentImage.imageID && 
                                   an.imageID === recentImage.imageID
                        );

                        // Only look for disease identification if analysis exists
                        if (an && an.analysisID) {
                            diseaseIdentified = diseaseidentified.find(
                                (di) => di.analysisID === an.analysisID
                            );
                        }
                    }

                    console.log(diseaseIdentified);

                    // Get tree image
                    const treeimage = treesimage.find(
                        (treeimage) =>
                            treeimage.treeID === tree.treeID &&
                            treeimage.status === 1
                    );

                    // Convert images to base64 if they exist
                    let treeImageBase64 = null;
                    let recentImageBase64 = null;

                    try {
                        if (treeimage?.imageData) {
                            treeImageBase64 = await convertBlobToBase64(
                                treeimage.imageData
                            );
                        }

                        if (recentImage?.imageData) {
                            recentImageBase64 = await convertBlobToBase64(
                                recentImage.imageData
                            );
                        }
                    } catch (error) {
                        console.error("Error converting image to base64:", error);
                        // Continue processing even if image conversion fails
                    }

                    return {
                        ...tree,
                        farmName: "",
                        treeImage: treeImageBase64,
                        recentImage: recentImage ? {
                            imageData: recentImageBase64,
                            diseaseName: diseaseIdentified?.diseaseName || null,
                            likelihoodScore: diseaseIdentified?.likelihoodScore || null
                        } : null,
                        imagesLength: relatedImages.length,
                    };
                } catch (error) {
                    console.error(`Error processing tree ${tree.treeID}:`, error);
                    // Return tree with minimal data if processing fails
                    return {
                        ...tree,
                        farmName: farm?.farmName || 'Unknown Farm',
                        treeImage: null,
                        recentImage: null,
                        imagesLength: 0,
                    };
                }
            })
        );

        return { success: true, data: treeWithImage };
    } catch (error) {
        console.error("Error fetching trees by farm ID:", error);
        return {
            success: false,
            message: "An error occurred while fetching trees by farm ID.",
        };
    }
};