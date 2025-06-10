import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { supabase } from "@/supabase/supabase";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { tree$ } from "./tree";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { analysis$ } from "./analysis";
import { analyzedimage$ } from "./analyzeimage";
import { diseaseidentified$ } from "./diseaseidentified";
import { loadingStore$ } from "./loading-store";
import { farm$ } from "./farm";

const userID = getUser()?.userID;

export const image$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.image.set(true);
                const { data, error } = await supabase
                    .from("image")
                    .select("*")
                    .eq("userID", userID)
                    .neq("status", 4);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching images:`, error);
                throw error;
            } finally {
                loadingStore$.image.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.treeID) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("image")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating image:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("pred_id is required for update");
                }

                const { data, error } = await supabase
                    .from("image")
                    .update(value)
                    .eq("id", value.id)
                    .eq("userID", userID)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating image:`, error);
                throw error;
            }
        },
        persist: {
            name: "image",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);

export const getImageByImageID = async (
    imageID: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
        const farms = Object.values(farm$.get() || {});
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const analyzedImages = Object.values(analyzedimage$.get() || {});
        const identifiedDiseases = Object.values(
            diseaseidentified$.get() || {}
        );

        // Find the image by imageID
        const image = images.find((img) => img.imageID === imageID);

        if (!image) {
            return { success: false, message: "Image not found." };
        }

        // Get additional details for the found image
        const tree = trees.find((t) => t.treeID === image.treeID);
        const analysisEntry = analysis.find((a) => a.imageID === imageID);
        const analyzedImage = analyzedImages.find(
            (ai) => ai.analysisID === analysisEntry?.analysisID
        );
        const disease = identifiedDiseases.find(
            (d) => d.analysisID === analysisEntry.analysisID
        );
        const farm = farms.find((f) => f.farmID === tree.farmID);
        console.log(farm);
        const res = {
            success: true,
            data: {
                ...image,
                ...analysisEntry,
                ...tree,
                farmID: farm.farmID,
                farmName: farm.farmName,
                imageData: convertBlobToBase64(image.imageData) || null,
                analyzedImage:
                    convertBlobToBase64(analyzedImage?.imageData) || null,
                disease: {
                    diseaseName: disease.diseaseName,
                    likelihoodScore: Number(disease.likelihoodScore.toFixed(1)),
                },
            },
        };
        return res;
    } catch (error) {
        console.error("Error fetching image by imageID:", error);
        return {
            success: false,
            message: "An error occurred while fetching the image.",
        };
    }
};
export const getImagesByTreeID = async (
    treeID: string
): Promise<{ success: boolean; data?: any[]; message?: string }> => {
    try {
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const analyzedImages = Object.values(analyzedimage$.get() || {});
        const identifiedDiseases = Object.values(
            diseaseidentified$.get() || {}
        );

        const treeImages = images.filter(
            (image) => image.treeID === treeID && image.status === 1
        );

        if (treeImages.length === 0) {
            return {
                success: false,
                message: "No images found for this tree.",
            };
        }

        const detailedImages = treeImages.map((image) => {
            const tree = trees.find((t) => t.treeID === image.treeID);
            const analysisEntry = analysis.find(
                (a) => a.imageID === image.imageID
            );
            const analyzedImage = analyzedImages.find(
                (ai) => ai.analysisID === analysisEntry?.analysisID
            );
            const disease = identifiedDiseases.find(
                (d) => d.analysisID === analysisEntry.analysisID
            );

            return {
                ...image,
                treeCode: tree?.treeCode || "Unknown",
                imageData: convertBlobToBase64(image.imageData) || null,
                analyzedImage:
                    convertBlobToBase64(analyzedImage?.imageData) || null,
                disease: {
                    diseaseName: disease.diseaseName,
                    likelihoodScore: Number(disease.likelihoodScore.toFixed(1)),
                },
            };
        });

        return { success: true, data: detailedImages };
    } catch (error) {
        console.error("Error fetching images by treeID:", error);
        return {
            success: false,
            message: "An error occurred while fetching images.",
        };
    }
};
export const getImagesByUserID = async (): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
}> => {
    try {
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});
        const analysis = Object.values(analysis$.get() || {});
        const analyzedImages = Object.values(analyzedimage$.get() || {});
        const identifiedDiseases = Object.values(
            diseaseidentified$.get() || {}
        );

        // Filter images by userID first
        const userImages = images.filter(
            (image) => image.userID === userID && image.status === 1
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
            const disease = identifiedDiseases.find(
                (d) => d.analysisID === analysisEntry.analysisID
            );
            if (tree.status === 1 && image.status === 1) {
                return {
                    ...image,
                    treeCode: tree?.treeCode || "Unknown",
                    imageData: convertBlobToBase64(image.imageData) || null,
                    analyzedImage:
                        convertBlobToBase64(analyzedImage?.imageData) || null,
                    disease: {
                        diseaseName: disease.diseaseName,
                        likelihoodScore: Number(
                            disease.likelihoodScore.toFixed(1)
                        ),
                    },
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
};
export const migrateImage = async (
    imageID: string,
    newTreeCode: string
): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const image = image$[imageID].get();
        if (!image) {
            return { success: false, message: "Image not found." };
        }

        // Find the tree with the new treeCode
        const tree = Object.values(tree$.get() || {}).find(
            (a) => a.treeCode === newTreeCode
        );

        if (!tree) {
            return {
                success: false,
                message: "Tree with the specified code not found.",
            };
        }

        // Update the image with the new treeID
        image$[imageID].set({
            ...image,
            treeID: tree.treeID,
        });

        return {
            success: true,
            message: "Image migrated successfully.",
            data: image$[imageID].get() || null,
        };
    } catch (error) {
        console.error("Error migrating image:", error);
        return {
            success: false,
            message: "An error occurred while migrating the image.",
        };
    }
};

export const saveScan = async (scanResult: any) => {
    try {
        const trees = Object.values(tree$.get() || {});
        const tree = trees.find((t) => t.treeCode === scanResult.treeCode);

        if (!tree) {
            return {
                success: false,
                message: "Tree not found for the given treeCode.",
            };
        }
        console.log(scanResult);

        const treeID = tree.treeID;
        const imageID = uuidv4();

        image$[imageID].set({
            imageID: imageID,
            userID,
            treeID: treeID,
            imageData: convertImageToBlob(scanResult.originalImage),
            status: 1,
            uploadedAt: new Date(),
        });

        const analysisID = uuidv4();
        analysis$[analysisID].set({
            analysisID: analysisID,
            imageID: imageID,
            status: 1,
            analyzedAt: new Date(),
        });
        const analyzedimageID = uuidv4();
        analyzedimage$[analysisID].set({
            analyzedimageID: analyzedimageID,
            analysisID: analysisID,
            imageData: convertImageToBlob(scanResult.analyzedImage),
        });
        const diseases = scanResult.diseases;
        diseases.forEach((disease: any) => {
            const diseaseidentifiedID = uuidv4();
            diseaseidentified$[diseaseidentifiedID].set({
                diseaseidentifiedID: diseaseidentifiedID,
                analysisID: analysisID,
                diseaseName: disease.diseaseName,
                diseaseID: null,
                likelihoodScore: disease.likelihoodScore,
            });
        });
        return { success: true, message: "Scan saved successfully." };
    } catch (error) {
        console.error("Error saving scan:", error);
        return {
            success: false,
            message: "An error occurred while saving the scan.",
        };
    }
};
