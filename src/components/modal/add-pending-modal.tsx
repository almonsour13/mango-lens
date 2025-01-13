import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddPendingModalProps {
  open: boolean
  onClose: (value: boolean) => void
  onConfirm: () => void
}

export default function AddPendingModal({
  open,
  onClose,
  onConfirm
}: AddPendingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>No Internet Connection</DialogTitle>
          <DialogDescription>
            Your current action cannot be completed due to a lack of internet connectivity.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Would you like to add this process to the pending queue? It will be completed automatically when the connection is restored.
          </p>
        </div>
        <DialogFooter className="gap-2">
            <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
            >
                Cancel
            </Button>
            <Button 
                variant="default"
                onClick={onConfirm}
            >
                Add to Pending
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

