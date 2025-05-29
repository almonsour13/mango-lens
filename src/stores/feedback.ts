import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { feedbackResponse$ } from "./feedbackResponse";
import { loadingStore$ } from "./loading-store";
import { Feedback } from "@/types/types";

const userID = getUser()?.userID;

export const feedback$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.feedback.set(true);
                const { data, error } = await supabase
                    .from("feedback")
                    .select("*")
                    .eq("userID", userID);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching feedback:`, error, userID);
                throw error;
            } finally {
                loadingStore$.feedback.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("feedback")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating feedback:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("pred_id is required for update");
                }

                const { data, error } = await supabase
                    .from("feedback")
                    .update(value)
                    .eq("id", value.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating feedback:`, error);
                throw error;
            }
        },
        persist: {
            name: "feedback",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
export const getFeedbackWithResponses = async () => {
    try {
        const feedbackEntries = Object.values(feedback$.get() || {});
        const responseEntries = Object.values(feedbackResponse$.get() || {});
        const combinedFeedback = feedbackEntries.map((feedback) => {
            const associatedResponses = responseEntries.filter(
                (response) => response.feedbackID === feedback.feedbackID
            );
            return {
                ...feedback,
                responses: associatedResponses,
            };
        });
        return { success: true, data: combinedFeedback };
    } catch (error) {
        console.error(`Error retrieving feedback:`, error);
        return {
            success: false,
            message: "An error occurred while retrieving feedback.",
        };
    }
};
export const submitFeedback = async (feedback: Feedback) => {
    try {
        if (!feedback) {
            return { success: false, message: "Feedback cannot be empty." };
        }

        const feedbackID = uuidv4();

        feedback$[feedback.feedbackID].set(feedback);

        return {
            success: true,
            message: "Feedback submitted successfully.",
            feedbackID,
        };
    } catch (error) {
        console.error(`Error submitting feedback:`, error);
        return {
            success: false,
            message: "An error occurred while submitting feedback.",
        };
    }
};
