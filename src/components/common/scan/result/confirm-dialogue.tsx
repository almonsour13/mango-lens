import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
    showConfirmDialog: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ showConfirmDialog, onCancel, onConfirm }) => (
    <Dialog open={showConfirmDialog} onOpenChange={onCancel}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                    Are you sure you want to discard the scan result? This
                    action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    Discard
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default ConfirmDialog;

