import { BoundingBox, ScanResult } from "@/types/types";

const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.ML_SERVICE_API
        : "http://localhost:5000";

type PredictionResponse = ScanResult

export const predict = async (
    image: string
): Promise<PredictionResponse | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify content type
            },
            body: JSON.stringify({ image: image }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PredictionResponse = await response.json();
        return {
            ...data,
            diseases: null, // Kept as per original code
        };
    } catch (error) {
        console.error("Error in predict function:", error);
        return null;
    }
};
