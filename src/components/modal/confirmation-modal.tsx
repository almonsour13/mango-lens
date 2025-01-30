import { Button } from "../ui/button";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../ui/dialog";
import ModalDrawer from "./modal-drawer-wrapper"

interface ConfirmationModalProps {
    open: boolean;
    onClose: (value:boolean) => void;
    onConfirm: () => void;
    title: string;
    content: string;
}

export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    content,
}: ConfirmationModalProps) {
    return (
        <ModalDrawer open={open} onOpenChange={onClose}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{content}</DialogDescription>
                </DialogHeader>
                <div className="gap-2 flex flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={()=>onClose(false)}
                    className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button  variant="destructive"  onClick={onConfirm}
                    className="flex-1">
                        Confirm
                    </Button>
                </div>
        </ModalDrawer>
    );
}
