import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { loadingStore$ } from "./loading-store";

const userID = getUser()?.userID;

export const feedbackResponse$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.feedbackResponse.set(true);
                const feedbackIDs =
                    (
                        await supabase
                            .from("feedback")
                            .select("feedbackID")
                            .eq("userID", userID)
                    ).data?.map((t) => t.feedbackID) || [];
                if (!feedbackIDs || feedbackIDs.length === 0) {
                    return [];
                }
                const { data, error } = await supabase
                    .from("feedbackResponse")
                    .select("*")
                    .eq("status", 1)
                    .in("feedbackID", feedbackIDs);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching feedbackResponse:`, error);
                throw error;
            }finally {
                            loadingStore$.feedbackResponse.set(false);
                        }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("feedbackResponse")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating feedbackResponse:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("pred_id is required for update");
                }

                const { data, error } = await supabase
                    .from("feedbackResponse")
                    .update(value)
                    .eq("id", value.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating feedbackResponse:`, error);
                throw error;
            }
        },
        persist: {
            name: "feedbackResponse",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
interface AddResponseProps {
    feedbackResponseID: string;
    feedbackID: string;
    userID: string;
    content: string;
    status: number;
    feedbackResponseAt: Date;
}
export const addResponse = (val:AddResponseProps) => {
    feedbackResponse$[val.feedbackResponseID].set(val)
};
