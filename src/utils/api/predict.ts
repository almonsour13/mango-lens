import { BoundingBox, Disease, DiseaseIdentified, ScanResult } from "@/types/types";

const API_BASE_URL = "https://pcjkn8p3-5000.asse.devtunnels.ms"

type PredictionResponse = ScanResult;

export const predict = async (image: string): Promise<PredictionResponse | null> => {
    try {
        // Send the image to the ML service for prediction
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify content type
            },
            body: JSON.stringify({ image }),
        });

        // Handle error if the response is not OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 

        // Parse the prediction response
        const data = await response.json();

        // Fetch disease information based on predictions
        const diseaseResponse = await fetch(`/api/scan/disease`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ predictions: data?.predictions }),
        });

        // Handle error for the disease API
        if (!diseaseResponse.ok) {
            throw new Error(`HTTP error from disease API! status: ${diseaseResponse.status}`);
        }

        // Parse the disease data
        const diseaseData = await diseaseResponse.json();
        const {diseases} = diseaseData
        return {
            ...data,
            diseases: diseases as (DiseaseIdentified & Disease)[], // Ensure the type is compatible
        };
    } catch (error) {
        console.error("Error in predict function:", error);
        return null;
    }
};
