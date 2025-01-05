"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, Save, Trash2, RefreshCcw } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useScanResult } from "@/context/scan-result-context";
import { useAuth } from "@/context/auth-context";
import ResultImage from "../../result-image";
import ResultDetails from "./result-details";
import ConfirmDialog from "./confirm-dialogue";
import ShowImage from "./show-image";

export default function ResultDisplay() {
    const { scanResult, setScanResult } = useScanResult();
    const [isVisible, setIsVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { userInfo } = useAuth();

    useEffect(() => {
        if (scanResult) {
            setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
        }
    }, [scanResult]);

    if (!scanResult) return null;

    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            const saveResponse = await fetch("/api/scan/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID: userInfo?.userID, scanResult }),
            });

            if (!saveResponse.ok) {
                const { error } = await saveResponse.json();
                throw new Error(error || "Failed to save analysis result.");
            }
            if (saveResponse.ok) {
                setIsVisible(false);
                setScanResult(null);
                setTimeout(() => {
                    toast({
                        title: "Result Saved",
                        description:
                            "The scan result has been saved successfully.",
                    });
                }, 300);
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Error while saving scan result:", error);
            toast({
                title: "Error",
                description:
                    "Failed to save the scan result. Please try again.",
            });
            setIsSaving(false);
        }
    }, []);

    const handleDiscard = () => {
        setIsVisible(false);
        setScanResult(null);
        toast({
            title: "Result Discarded",
            description: "The scan result has been discarded.",
            variant: "destructive",
        });
    };

    const handleClose = () => setShowConfirmDialog(true);
    const handleConfirmDiscard = () => {
        setShowConfirmDialog(false);
        handleDiscard();
    };
    const handleCancelClose = () => setShowConfirmDialog(false);

    return (
        <>
            <div
                className={`fixed inset-0 top-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${
                    isVisible
                        ? "bg-opacity-60"
                        : "bg-opacity-0 pointer-events-none"
                }`}
                onClick={handleClose}
                aria-hidden="true"
            />
            <Card
                className={`absolute bottom-0 left-0 right-0 z-50 rounded-lg rounded-b-none rounded-t border-0 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${
                    isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                }`}
            >
                <CardHeader className="flex flex-row items-center justify-between top-0 z-10">
                    <CardTitle className="text-xl font-semibold">
                        Scan Result
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <ResultImage
                        originalImage={scanResult.originalImage}
                        analyzedImage={scanResult.analyzedImage}
                        boundingBoxes={scanResult.boundingBoxes}
                    />
                    <ResultDetails scanResult={scanResult} />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        variant="destructive"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        <Trash2 className="h-4 w-4" />
                        Discard
                    </Button>
                    <Button
                        className="bg-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <RefreshCcw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Result
                    </Button>
                </CardFooter>
            </Card>
            <ConfirmDialog
                showConfirmDialog={showConfirmDialog}
                onCancel={handleCancelClose}
                onConfirm={handleConfirmDiscard}
            />
            <ShowImage
                imageUrl={scanResult.originalImage || ""}
                showImageDialog={showImageDialog}
                setShowImageDialog={setShowImageDialog}
            />
        </>
    );
}
