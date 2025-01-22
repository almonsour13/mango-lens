import { Tree } from "@/types/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TreeDeciduous } from "lucide-react";
import { TreeActionMenu } from "../action menu/tree-action-menu";
import { formatDate } from "date-fns";

interface TreeWithImage extends Tree {
    recentImage: string | null;
    imagesLength: number;
}
export const TreeTable = ({
    trees,
    handleAction,
}: {
    trees: TreeWithImage[];
    handleAction: (e: React.MouseEvent<HTMLDivElement>, action: string, treeID: string) => void;
}) => {
    return (
        <Table className="border-0">
            <TableHeader className="bg-transparent">
                <TableRow>
                    <TableHead className="table-cell"></TableHead>
                    <TableHead className="table-cell">Tree Code</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Number of Images
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Date Added
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trees &&
                    trees.length > 0 &&
                    trees.map((tree, index) => (
                        <TableRow key={index}>
                            <TableCell className="w-10">
                                <TreeDeciduous className="opacity-20" />
                            </TableCell>
                            <TableCell>{tree.treeCode}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {tree.imagesLength}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {tree.status}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {formatDate(tree.addedAt, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                                <TreeActionMenu
                                    treeID={tree.treeID}
                                    treeCode={tree.treeCode}
                                    status={tree.status}
                                    handleAction={handleAction}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};
