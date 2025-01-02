
import { usePathname } from "next/navigation";
import { Check, Edit, Eye, MoreHorizontal, MoreVertical, RefreshCcw, Save, Scan, Trash2, TreeDeciduous } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionMenuProps {
    pendingID: number;
    status:number;
    handleAction: (action: number, pendingID: number) => void;
}
export function PendingActionMenu({ pendingID, status, handleAction }: ActionMenuProps) {
    const pathname = usePathname();

    const pathSegments = pathname.split("/");
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
                        onClick={(e) => handleAction(3, pendingID)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Analysis
                    </DropdownMenuItem>
                )}
                {status == 2 && (
                    <DropdownMenuItem
                        onClick={(e) => handleAction(4, pendingID)}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Analysis
                    </DropdownMenuItem>
                )}
                {status == 1 && (
                    <DropdownMenuItem
                        onClick={(e) => handleAction(1, pendingID)}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Process
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={(e) => handleAction(2, pendingID)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}