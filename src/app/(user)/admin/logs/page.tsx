"use client";

import { useEffect, useState } from "react";
import { Search, File, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import PageWrapper from "@/components/wrapper/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import { Log } from "@/type/types";


export default function AdminActivityLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedLogID, setSelectedLogID] = useState(0);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/log");

            if (!response.ok) {
                throw new Error("Failed to fetch logs");
            }
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(
        (log) =>
            log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userID.toString().includes(searchTerm),
    );

    const handleAction = async (action: string, logID: number) => {
        if (action === "Delete") {
            setConfirmationModalOpen(true);
            setSelectedLogID(logID)
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch('/api/log', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ logID:selectedLogID }),
            });
      
            const result = await response.json();
      
            if (result.success) {
              toast({
                title: `Delete Disease`,
                description: `Delete action performed on disease ${selectedLogID}`,
              })
              fetchLogs()
            }
          } catch (error) {
            console.error('Error deleting disease:', error);
          };
        setSelectedLogID(0)
        setConfirmationModalOpen(false);
    };
    return (
        <PageWrapper>
            <CardHeader className="p-0">
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                    View and manage all system activity logs.
                </CardDescription>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs..."
                        className="pl-8 h-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Log ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Activity</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.logID}>
                                        <TableCell>{log.logID}</TableCell>
                                        <TableCell>{log.userID}</TableCell>
                                        <TableCell>{log.activity}</TableCell>
                                        <TableCell>{log.type}</TableCell>
                                        <TableCell>
                                            {/* {formatDate(log.createdAt)} */}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ActionMenu
                                                logID={log.logID}
                                                handleAction={handleAction}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        No logs found.{" "}
                                        {searchTerm &&
                                            "Try adjusting your search."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ConfirmationModal
                open={confirmationModalOpen}
                onClose={setConfirmationModalOpen}
                onConfirm={handleConfirmDelete}
                title="Are you sure?"
                content="This action cannot be undone."
            />
        </PageWrapper>
    );
}
interface ActionMenuProps {
    logID: number;
    handleAction: (action: string, logID: number) => void;
}
function ActionMenu({ logID, handleAction }: ActionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction("Delete", logID)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
const TableSkeleton = () => (
    <>
        {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
                <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell className='text-center'  >
                    <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
            </TableRow>
        ))}
    </>
);
