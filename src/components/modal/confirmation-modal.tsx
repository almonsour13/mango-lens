import { Button } from "../ui/button";
import { DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog";
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
                </DialogHeader>
                <div className="text-sm text-center">{content}</div>
                <DialogFooter className="gap-2 md:gap-4 flex-row justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={()=>onClose(false)}
                    >
                        Cancel
                    </Button>
                    <Button  variant="destructive"  onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
        </ModalDrawer>
    );
}
