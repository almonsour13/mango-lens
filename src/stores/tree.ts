import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { supabase } from "@/supabase/supabase";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { checkTreeCode } from "@/utils/tree-utils";
import { convertBlobToBase64 } from "@/utils/image-utils";
import { image$ } from "./image";

const userID = getUser()?.userID;

export const tree$ = observable(
    syncPlugin({
        list: async () => {
            try {
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

export const getTreeByUser = async (): Promise<{ success: boolean; data?: any[]; message?: string }> => {
    try {
        const trees = Object.values(tree$.get() || {}); 
        const images = Object.values(image$.get() || {});
        const userTrees = trees.filter(tree => tree.userID === userID && tree.status === 1);

        if (userTrees.length === 0) {
            return { success: false, message: "No trees found for this user." };
        }

        const treeWithImage = userTrees.map((tree) => {
            const relatedImages = images.filter(image => image.treeID === tree.treeID && image.status === 1);

            const recentImage = relatedImages.sort(
                (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )[0];

            const recentImageBase64 = recentImage 
                ? convertBlobToBase64(recentImage.imageData) 
                : null;

            return {
                ...tree,
                treeImage: recentImageBase64, 
                recentImage: recentImageBase64,
                imagesLength: relatedImages.length,
            };
        });

        return { success: true, data: treeWithImage };

    } catch (error) {
        console.error("Error fetching trees by user:", error);
        return { success: false, message: "An error occurred while fetching trees." };
    }
};
export const getTreeByID = async (treeID: string) => {
    const tree = tree$[treeID]?.get();
    if (!tree || tree.status !== 1) {  // Assuming 1 means "active"
        return null;
    }
    return tree;
};
export const updateTreeByID = async (
    treeID: string,
    treeCode: string,
    description: string,
    status: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const trees = tree$.get() || {}; // Get all trees
        
        if (!trees[treeID]) {
            return { success: false, message: "Tree not found." };
        }
        
        if(Object.values(trees).some(t => t.treeCode === treeCode && t.treeID !== treeID)){
            return { success: false, message: "Tree code already exists." };
        }
        tree$[treeID].set({
            treeCode,
            description,
            status: status === "Active" ? 1 : 2,
            updatedAt: new Date(),
        });

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
    treeCode: string,
    description: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const treeID = uuidv4();

        if (await checkTreeCode(treeCode)) {
            return { success: false, message: "Tree code already exists." };
        }

        tree$[treeID].set({
            treeID,
            userID,
            treeCode,
            description,
            status: 1,
            addedAt: new Date(),
        });

        return { success: true, message: "Tree added successfully." };
    } catch (error) {
        console.error("Error adding tree:", error);
        return {
            success: false,
            message: "An error occurred while adding the tree.",
        };
    }
};
