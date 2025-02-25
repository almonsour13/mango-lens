import { TableCell, TableRow } from "../ui/table";

export default function TableSkeleton(){
    return(
        <>
            <TableRow>
                <TableCell colSpan={6}>
                    <div className="flex-1 h-8 bg-muted animate-pulse" />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={3}>
                    <div className="flex-1 h-8 bg-muted animate-pulse" />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2}>
                    <div className="flex-1 h-8 bg-muted animate-pulse" />
                </TableCell>
            </TableRow>
        </>
    )
}