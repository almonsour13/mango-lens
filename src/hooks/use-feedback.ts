import { useState, useEffect, useCallback } from "react";
import { Feedback as FB } from "@/types/types";
import { loadingStore$ } from "@/stores/loading-store";
import { getFeedbackWithResponses } from "@/stores/feedback";

type Feedback = FB & {
    responses: {
        feedbackResponseID: string;
        feedbackID: string;
        userID: string;
        content: string;
        status: number;
        feedbackResponseAt: Date;
    }[];
};
export const useFeedback = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackResponseLoading, setFeedbackResponseLoading] =
        useState(false);

    useEffect(() => {
        const unsubscribeFeedback = loadingStore$.feedback.onChange(
            ({ value }) => setFeedbackLoading(value)
        );
        const unsubscribeFeedbackResponse =
            loadingStore$.feedbackResponse.onChange(({ value }) =>
                setFeedbackResponseLoading(value)
            );

        return () => {
            unsubscribeFeedback();
            unsubscribeFeedbackResponse();
        };
    }, []);

    const fetchFeedback = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getFeedbackWithResponses();
            if (res.success) {
                setFeedbacks(res.data as Feedback[]);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeedback();
    }, [feedbackLoading, feedbackResponseLoading, fetchFeedback]);

    return { feedbacks, setFeedbacks, loading };
};
