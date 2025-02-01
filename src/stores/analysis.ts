import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { getUser } from "./user-store";
import { loadingStore$ } from "./loading-store";

const userID = getUser()?.userID;

export const analysis$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.analysis.set(true);
                const imageIDs =
                    (
                        await supabase
                            .from("image")
                            .select("imageID")
                            .eq("userID", userID)
                    ).data?.map((t) => t.imageID) || [];

                if (!imageIDs || imageIDs.length === 0) {
                    return [];
                }
                const { data, error } = await supabase
                    .from("analysis")
                    .select("*")
                    .eq("status", 1)
                    .in("imageID", imageIDs);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching images:`, error);
                throw error;
            } finally {
                loadingStore$.analysis.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("analysis")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating analysis:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("pred_id is required for update");
                }

                const { data, error } = await supabase
                    .from("analysis")
                    .update(value)
                    .eq("id", value.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating analysis:`, error);
                throw error;
            }
        },
        persist: {
            name: "analysis",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
