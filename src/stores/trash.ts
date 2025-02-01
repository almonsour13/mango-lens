import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "./user-store";
import { tree$ } from "./tree";
import { image$ } from "./image";
import { convertBlobToBase64 } from "@/utils/image-utils";

const userID = getUser()?.userID;

export const trash$ = observable(
    syncPlugin({
        list: async () => {
            try {
                const { data, error } = await supabase
                    .from("trash")
                    .select("*")
                    .eq("userID", userID)
                    .neq("status", 4);

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
                    .from("trash")
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
                    .from("trash")
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
            name: "trash",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
export const manageTrash = async (trashIDs: string[], action: number) => {
    try {
        if (!trashIDs.length) {
            throw new Error("No trash items provided.");
        }

        // Define action mapping
        const statusMap = {
            1: {
                itemStatus: 1,
                trashStatus: 3,
                message: "Trash items restored successfully.",
            },
            2: {
                itemStatus: 4,
                trashStatus: 2,
                message: "Trash items deleted successfully.",
            },
        } as const;

        if (action !== 1 && action !== 2) {
            throw new Error("Invalid action provided.");
        }

        const { itemStatus, trashStatus, message } = statusMap[action];

        for (const trashID of trashIDs) {
            const trash = trash$[trashID].get();
            if (!trash) {
                console.warn(`Trash item ${trashID} not found. Skipping.`);
                continue;
            }

            if (trash.type === 1) {
                tree$[trash.itemID].set({
                    status: itemStatus,
                    updatedAt: new Date(),
                });
                const images = Object.values(image$.get() || {});
                if (images.length > 0) {
                    images
                        .filter((img) => img.treeID === trash.itemID)
                        .forEach((im) => {
                            image$[im.imageID].set({
                                itemStatus: itemStatus,
                                updatedAt: new Date(),
                            });
                        });
                }
            } else if (trash.type === 2) {
                image$[trash.itemID].set({
                    status: itemStatus,
                    updatedAt: new Date(),
                });
            }

            trash$[trashID].set({ status: trashStatus });
        }

        return { success: true, message };
    } catch (error) {
        console.error(`Error managing trash items (action: ${action}):`, error);
        return {
            success: false,
            message: `An error occurred while trying to ${
                action === 1 ? "restore" : "delete"
            } the trash items.`,
        };
    }
};

export const getTrashByUser = async () => {
    try {
        const trash = Object.values(trash$.get() || {});
        const trees = Object.values(tree$.get() || {});
        const images = Object.values(image$.get() || {});

        // Filter trash items for the user
        const filteredTrash = trash.filter(
            (t) => t.userID === userID && t.status === 1
        );

        const transformedTrash = filteredTrash.map((ft) => {
            if (ft.type === 1) {
                const treeItem =
                    trees.find((t) => t.treeID === ft.itemID) || null;
                return { ...ft, item: treeItem };
            } else if (ft.type === 2) {
                const imageItem =
                    images.find((i) => i.imageID === ft.itemID) || null;
                return {
                    ...ft,
                    item: imageItem
                        ? {
                              ...imageItem,
                              imageData: convertBlobToBase64(
                                  imageItem.imageData
                              ),
                          }
                        : null,
                };
            }
        });
        return transformedTrash.length > 0 ? transformedTrash : null;
    } catch (error) {
        console.error("Error fetching trash by user:", error);
        return null;
    }
};
export const moveToTrash = async (
    itemID: string,
    type: number
): Promise<{ success: boolean; message: string }> => {
    try {
        if (type === 1 && !tree$[itemID]) {
            return { success: false, message: "Tree not found." };
        } else if (type === 2 && !image$[itemID]) {
            return { success: false, message: "Image not found." };
        }

        if (type === 1) {
            tree$[itemID].set({
                status: 3, // Trashed status
                updatedAt: new Date(),
            });

            const images = Object.values(image$.get() || {});
            if (images.length > 0) {
                images
                    .filter((img) => img.treeID === itemID && img.status === 1)
                    .forEach((im) => {
                        image$[im.imageID].set({
                            status: 3,
                            updatedAt: new Date(),
                        });
                    });
            }
        } else if (type === 2) {
            image$[itemID].set({
                status: 3, // Trashed status
                updatedAt: new Date(),
            });
        }

        const trashID = uuidv4();
        trash$[trashID].set({
            trashID: trashID,
            userID: userID,
            itemID: itemID,
            type: type,
            status: 1,
            deletedAt: new Date(),
        });

        return {
            success: true,
            message: `${
                type === 1 ? "Tree" : "Image"
            } moved to trash successfully.`,
        };
    } catch (error) {
        console.error("Error moving to trash:", error);
        return {
            success: false,
            message: "An error occurred while moving the item to trash.",
        };
    }
};
