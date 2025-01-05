import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, ImageIcon, LoaderCircle } from "lucide-react";
import { useCallback } from "react";
import { PendingActionMenu } from "../action menu/pending-action-menu";
import { formatDate } from "date-fns";

interface PendingProcess {
    pendingID: number;
    userID?: number;
    treeCode: string;
    imageUrl: string;
    status: number;
    addedAt: Date;
}

export const PendingTable = ({
    processPendingID,
    pendings,
    isSelected,
    selected,
    setSelected,
    handleAction,
}: {
    processPendingID: number;
    pendings: PendingProcess[];
    isSelected: boolean;
    selected: number[];
    setSelected: (value: number[]) => void;
    handleAction: (action: number, pendingID: number) => void;
}) => {
    const handleCheck = useCallback(
        (trashID: number) => {
            if (isSelected) {
                setSelected(
                    selected.includes(trashID)
                        ? selected.filter((id: number) => id !== trashID)
                        : [...selected, trashID]
                );
            }
        },
        [isSelected, selected, setSelected]
    );

    const isItemSelected = useCallback(
        (trashID: number) => selected.includes(trashID),
        [selected]
    );

    return (
        <Table className="border-0">
            <TableHeader className="bg-transparent">
                <TableRow>
                    <TableHead className="table-cell"></TableHead>
                    <TableHead className="hidden md:table-cell">
                        Tree Code
                    </TableHead>
                    <TableHead className="table-cell">Status</TableHead>
                    <TableHead className="table-cell">Date Added</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pendings &&
                    pendings.length > 0 &&
                    pendings.map((pending, index) => {
                        return (
                            <TableRow
                                key={index}
                                onClick={() => handleCheck(pending.pendingID)}
                                className={`${
                                    isItemSelected(pending.pendingID)
                                        ? "bg-muted"
                                        : ""
                                }`}
                            >
                                <TableCell className="w-10">
                                    {processPendingID == pending.pendingID ? (
                                        <div className="w-4">
                                            <LoaderCircle className="text-primary animate-spin" />
                                        </div>
                                    ) : isSelected ? (
                                        <div
                                            className={`h-4 w-4 flex items-center justify-center rounded border-primary border-2 ${
                                                isItemSelected(
                                                    pending.pendingID
                                                )
                                                    ? "bg-primary"
                                                    : ""
                                            }`}
                                            role="checkbox"
                                            aria-checked={isItemSelected(
                                                pending.pendingID
                                            )}
                                            tabIndex={0}
                                        >
                                            {isItemSelected(
                                                pending.pendingID
                                            ) && (
                                                <Check
                                                    className="h-4 w-4 text-primary-foreground"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <ImageIcon className="opacity-20" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="table-cell">
                                    {pending.treeCode}
                                </TableCell>
                                <TableCell
                                    className={`hidden md:table-cell ${
                                        pending.status == 1
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }`}
                                >
                                    {pending.status == 1
                                        ? "Pending"
                                        : "Processed"}
                                </TableCell>
                                <TableCell className="table-cell">
                                    {formatDate(
                                        pending.addedAt,
                                        "MMM dd, yyyy"
                                    )}
                                </TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    <PendingActionMenu
                                        pendingID={pending.pendingID}
                                        status={pending.status}
                                        handleAction={handleAction}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};
