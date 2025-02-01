import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { getUser } from "./user-store";
import { getTreeByUser } from "./tree";
import { loadingStore$ } from "./loading-store";

const userID = getUser()?.userID;
export const treeimage$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.treeimage.set(true);
                const treeIDs =
                    (
                        await supabase
                            .from("tree")
                            .select("treeID")
                            .eq("userID", userID)
                            .neq("status", 4)
                    ).data?.map((t) => t.treeID) || [];

                if (!treeIDs || treeIDs.length === 0) {
                    return [];
                }

                const { data, error } = await supabase
                    .from("treeimage")
                    .select("*") // Select only treeimage data
                    .eq("status", 1)
                    .in("treeID", treeIDs);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching treeimage:`, error);
                throw error;
            } finally {
                loadingStore$.treeimage.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("treeimage")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating treeimage:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required for update");
                }

                const { data, error } = await supabase
                    .from("treeimage")
                    .update(value)
                    .eq("id", value.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating treeimage:`, error);
                throw error;
            }
        },
        persist: {
            name: "treeimage",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
