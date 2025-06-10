"use client";
import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import * as tf from "@tensorflow/tfjs";
import { gradClassActivationMap } from "@/utils/model/grad-cam";
import { generateHeatmapOverlay } from "@/utils/model/gerenerate-overlay";
import { useToast } from "@/hooks/use-toast";
import { ScanResult, TfJsDisease } from "@/types/types";
import { classes } from "@/constant/classes";


interface PredictionResult {
    className: string;
    probability: number;
    probabilities: Array<{
        className: string;
        probability: number;
    }>;
    imageRmvBg?: string;
    heatmapUrl?: string;
}

type PredictionResponse = ScanResult;
// Define the type for the context
interface ModelContextType {
    model: tf.LayersModel | null;
    isLoading: boolean;
    isAnalyzing: boolean;
    setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    showGradCam: boolean;
    setShowGradCam: React.Dispatch<React.SetStateAction<boolean>>;
    prediction: PredictionResult | null;
    setPrediction: React.Dispatch<
        React.SetStateAction<PredictionResult | null>
    >;
    tfPredict: (image: string) => Promise<ScanResult | null> ;
}

// Create the context with a default value
const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Create the provider component
export function ModelProvider({ children }: { children: ReactNode }) {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [showGradCam, setShowGradCam] = useState(false);
    const { toast } = useToast();

    // Load the TensorFlow.js model
    const loadModel = useCallback(async () => {
        try {
            const loadedModel = await tf.loadLayersModel("/model/model.json");
            setModel(loadedModel);
            setIsLoading(false);
            console.log("Model is loaded");
        } catch (err) {
            toast({
                description: `Prediction failed: ${
                    err instanceof Error ? err.message : "Unknown error"
                }`,
                variant: "destructive",
            });
            setIsLoading(false);
        }
    }, [toast]);

    // Optionally, load the model on mount
    useEffect(() => {
        loadModel();
    }, [loadModel]);


    const preprocessImage = async (
        imageElement: HTMLImageElement
    ): Promise<tf.Tensor> => {
        return tf.tidy(() => {
            const tensor = tf.browser
                .fromPixels(imageElement)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat()
                .div(255.0);
            return tensor;
        });
    };

    const tfPredict = async (image: string)=> {
        setIsAnalyzing(true);
        setPrediction(null);

        try {
            if (!model) {
                return null
            }

            const img = new Image();
            img.src = image;
            // const imageRmvBg = await removeBg(img);
            // if(imageRmvBg){
            //     setPrediction((prev) => ({
            //         ...prev!,
            //         imageRmvBg: imageRmvBg as string,
            //     }));
            // }
            const inputTensor = await preprocessImage(img);
            const predictionTensor = model.predict(inputTensor) as tf.Tensor;
            const predictionArray = await predictionTensor.data();
            const predictedClassIndex = predictionArray.indexOf(
                Math.max(...predictionArray)
            );

            const predictionWithClasses:TfJsDisease[] = Array.from(predictionArray).map(
                (prob, idx) => ({
                    diseaseName: classes[idx],
                    likelihoodScore: Number((prob * 100).toFixed(1)),
                })
            ).filter(prob => prob.likelihoodScore > 30);

            predictionWithClasses.sort((a, b) => b.likelihoodScore - a.likelihoodScore);
                
            const heatmaps = await gradClassActivationMap(model, inputTensor, [
                predictedClassIndex,
            ]);
            const isHealthy = classes[predictedClassIndex] === "Healthy"
            const heatmapUrl = await generateHeatmapOverlay(heatmaps[0], img, isHealthy);
            const resizedOriginal = await resizeImage(image, 224, 224);
            
            const resizedHeatmap = await resizeImage(heatmapUrl || '', 224, 224);
            
            const result:ScanResult = {
                treeCode:"",
                farmName:"",
                originalImage: resizedOriginal,
                analyzedImage: resizedHeatmap,
                diseases:[predictionWithClasses[0]]
            }

            // Helper function to resize images
            async function resizeImage(dataUrl: string, width: number, height: number): Promise<string> {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg'));
                    };
                    img.src = dataUrl;
                });
            }
            tf.dispose([inputTensor, predictionTensor]);
            return result;
        } catch (err) {
            toast({
                description: `Prediction failed: ${
                    err instanceof Error ? err.message : "Unknown error"
                }`,
                variant: "destructive",
            });
            console.log("Error during prediction:", err instanceof Error ? err.message : "Unknown error");
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <ModelContext.Provider
            value={{
                model,
                isLoading,
                isAnalyzing,
                error,
                setError,
                setIsAnalyzing,
                showGradCam,
                setShowGradCam,
                prediction,
                setPrediction,
                tfPredict,
            }}
        >
            {children}
        </ModelContext.Provider>
    );
}

export const useModel = () => {
    const context = React.useContext(ModelContext);
    if (!context) {
        throw new Error("useModel must be used within a ModelProvider");
    }
    return context;
};
