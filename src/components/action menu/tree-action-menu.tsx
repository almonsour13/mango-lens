import { usePathname } from "next/navigation";
import {
    Edit,
    MoreVertical,
    Scan,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ActionMenuProps {
    treeID: string;
    treeCode: string;
    status: number;
    handleAction: (e: React.MouseEvent<HTMLDivElement>, action: string, treeID: string) => void;
}
export function TreeActionMenu({
    treeID,
    treeCode,
    status,
    handleAction,
}: ActionMenuProps) {
    const pathname = usePathname();

    const pathSegments = pathname.split("/");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <MoreVertical size={16} className="text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {status == 1 && (
                    <Link
                        href={`${
                            pathSegments[0] + "/" + pathSegments[1]
                        }/scan/?treeCode=${treeCode}`}
                    >
                        <DropdownMenuItem>
                            <Scan className="mr-2 h-4 w-4" />
                            Scan image
                        </DropdownMenuItem>
                    </Link>
                )}{" "}
                <Link href={`${pathname}/${treeID}/edit`}>
                    <DropdownMenuItem
                    // onClick={(e) => handleAction(e, "Edit", treeID)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                    onClick={(e) => handleAction(e, "Delete", treeID)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Move to trash
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
