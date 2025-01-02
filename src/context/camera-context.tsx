"use client";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Check,
    ImageIcon,
    Scan,
    SwitchCamera,
    X,
} from "lucide-react";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useRef,
    useCallback,
    useEffect,
} from "react";
import Image from "next/image";

interface CameraContextType {
    isCameraOpen: boolean;
    setIsCameraOpen: (v: boolean) => void;
    capturedImage: string;
    setCapturedImage: (v: string) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

interface ImageData {
    page: string;
    captureImage: string;
}

export const CameraProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string>("");
    const [imageData, setImageData] = useState<ImageData | null>(null);

    const getImageData = () => {};

    return (
        <CameraContext.Provider
            value={{
                isCameraOpen,
                setIsCameraOpen,
                capturedImage,
                setCapturedImage,
            }}
        >
            {children}
            {isCameraOpen && (
                <CameraPage
                    isCameraOpen={isCameraOpen}
                    setIsCameraOpen={setIsCameraOpen}
                    capturedImage={capturedImage}
                    setCapturedImage={setCapturedImage}
                />
            )}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () => {
    const context = useContext(CameraContext);
    if (!context) {
        throw new Error(
            "useCameraContext must be used within a CameraProvider"
        );
    }
    return context;
};

const CameraPage = ({
    isCameraOpen,
    setIsCameraOpen,
    capturedImage,
    setCapturedImage,
}: CameraContextType) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">(
        "environment"
    );
    useEffect(() => {
        if (!capturedImage) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [capturedImage, facingMode, isCameraOpen]);

    const handleCapture = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");

            const size = Math.min(video.videoWidth, video.videoHeight);
            canvas.width = size;
            canvas.height = size;

            const xOffset = (video.videoWidth - size) / 2;
            const yOffset = (video.videoHeight - size) / 2;

            context?.drawImage(
                video,
                xOffset,
                yOffset,
                size,
                size,
                0,
                0,
                size,
                size
            );

            const imageData = canvas.toDataURL("image/png");
            setCapturedImage(imageData);
        }
    };
    const handleCheck = () => {
        stopCamera();
        setIsCameraOpen(false);
    };
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setCapturedImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSwitchCamera = () => {
        setFacingMode(facingMode === "user" ? "environment" : "user");
    };

    const handleBack = () => {
        setIsCameraOpen(false);
    };

    const stopCamera = useCallback(async () => {
        const stream = streamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setHasPermission(true);
            }
        } catch (err) {
            setHasPermission(false);
        }
    }, [facingMode]);

    return (
        <div className="w-full min-h-screen h-full bg-background absolute z-[100] top-0">
            <div className="w-full max-w-md mx-auto flex flex-col gap-8 items-center justify-start">
                <div className="h-14 w-full flex justify-between items-center px-4">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-bold">Camera</h1>
                    <div className="w-6 h-6" />
                </div>
                <div className="w-full px-4">
                    <div className="relative w-full h-full overflow-hidden aspect-square rounded-lg bg-black">
                        {!capturedImage && (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                    onCanPlay={() => setIsCameraReady(true)}
                                />
                                <div className="flex-1">
                                    <div className="animate-zoom-border absolute top-4 left-4 w-16 h-16 border-8 rounded-tl-md border-primary border-r-0 border-b-0" />
                                    <div className="animate-zoom-border absolute top-4 right-4 w-24 h-24 border-8 rounded-tr-md border-primary border-l-0 border-b-0" />
                                    <div className="animate-zoom-border absolute bottom-4 left-4 w-24 h-24 border-8 rounded-bl-md border-primary border-r-0 border-t-0" />
                                    <div className="animate-zoom-border absolute bottom-4 right-4 w-24 h-24 border-8 rounded-br-md border-primary border-l-0 border-t-0" />
                                </div>
                            </>
                        )}
                        {capturedImage && (
                            <Image
                                src={capturedImage}
                                alt="Uploaded"
                                className="h-full w-full rounded-md object-cover"
                                width={256}
                                height={256}
                            />
                        )}
                        <canvas
                            ref={canvasRef}
                            className="hidden h-full w-full"
                            width={1280}
                            height={720}
                        />
                    </div>
                </div>
                <div className="w-full h-32 flex justify-between items-center px-8">
                    {!capturedImage ? (
                        <>
                            <Button
                                variant="outline"
                                className="w-16 h-16     rounded-full aspect-square"
                                onClick={() =>
                                    document
                                        .getElementById("image-input")
                                        ?.click()
                                }
                            >
                                <ImageIcon className="h-6 w-6" />
                                <input
                                    id="image-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />
                            </Button>
                            <button
                                className="w-24 h-24 rounded-full p-0 bg-primary flex items-center justify-center"
                                onClick={handleCapture}
                            >
                                <Scan className="h-8 w-8 text-white" />
                            </button>
                            <Button
                                variant="outline"
                                className="w-14 h-14 rounded-full aspect-square"
                                onClick={handleSwitchCamera}
                            >
                                <SwitchCamera className="h-6 w-6" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="w-14 h-14 rounded-full aspect-square"
                                onClick={() => {
                                    setCapturedImage("");
                                }}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="outline"
                                className="w-14 h-14 rounded-full aspect-square"
                                onClick={handleCheck}
                            >
                                <Check className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
