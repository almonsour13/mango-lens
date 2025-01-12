
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, RefreshCcw, Save, Trash2 } from "lucide-react";

interface ActionMenuProps {
    pendingID: number;
    status:number;
    handleAction: (action: number, pendingID: number) => void;
}
export function PendingActionMenu({ pendingID, status, handleAction }: ActionMenuProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors" >
                    <MoreVertical size={16} className="text-white" />
                  </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* <Link
                    href={`${pathSegments[0] + "/" + pathSegments[1]}/scan/?treeCode=${treeCode}`}
                >
                    <DropdownMenuItem>
                        <Scan className="mr-2 h-4 w-4" />
                        Scan image for this tree
                    </DropdownMenuItem>
                </Link> */}
                {status == 2 && (
                    <DropdownMenuItem
                        onClick={() => handleAction(3, pendingID)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Analysis
                    </DropdownMenuItem>
                )}
                {status == 2 && (
                    <DropdownMenuItem
                        onClick={() => handleAction(4, pendingID)}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Analysis
                    </DropdownMenuItem>
                )}
                {(status == 1 || status == 3) && (
                    <DropdownMenuItem
                        onClick={() => handleAction(1, pendingID)}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        {status == 1?"Process":"Reprocess"}
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() => handleAction(2, pendingID)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}