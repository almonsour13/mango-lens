"use client";

import { useCallback, useEffect, useState } from "react";
import {
    File,
    Edit,
    Trash2,
    Search,
    FileImage,
    PlusCircle,
    SlidersHorizontal,
    ArrowDownUp,
    MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { usePathname } from "next/navigation";
import DiseaseModal from "@/components/modal/disease-modal";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import Link from "next/link";
import { Disease } from "@/types/types";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";
import TableSkeleton from "@/components/skeleton/table-skeleton";

export default function DiseasesPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedDiseaseID, setSelectedDiseaseID] = useState(0);

    const { userInfo } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const fetchDiseases = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/admin/${userInfo?.userID}/disease`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch diseases");
            }
            const data = await response.json();
            setDiseases(data.diseases);
        } catch (error) {
            console.error("Error fetching diseases:", error);
            toast({
                title: "Error",
                description:
                    "Failed to fetch diseases. Please try again later.",
                variant: "destructive",
            });
            setDiseases([]);
        } finally {
            setLoading(false);
        }
    }, [userInfo?.userID, toast]);

    useEffect(() => {
        fetchDiseases();
    }, [fetchDiseases]);

    const filteredDiseases =
        diseases &&
        diseases
            .filter((disease) => {
                const nameMatch = disease.diseaseName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const emailMatch = disease.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const statusMatch =
                    filterStatus === 0 || disease.status === filterStatus;
                return (nameMatch || emailMatch) && statusMatch;
            })
            .sort((a, b) => {
                if (sortBy === "Newest") {
                    return (
                        new Date(b.addedAt).getTime() -
                        new Date(a.addedAt).getTime()
                    );
                } else {
                    return (
                        new Date(a.addedAt).getTime() -
                        new Date(b.addedAt).getTime()
                    );
                }
            });

    const handleAction = async (action: string, diseaseID: number) => {
        if (action === "Edit") {
            const disease = diseases.filter(
                (disease) => disease.diseaseID == diseaseID
            );
            setEditingDisease(disease[0]);
            setOpenDialog(true);
        } else if (action === "Delete") {
            setConfirmationModalOpen(true);
            setSelectedDiseaseID(diseaseID);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`/api/admin/${userInfo?.userID}/disease`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ diseaseID: selectedDiseaseID }),
            });

            const result = await res.json();

            if (result.success) {
                toast({
                    description: `Disease Deleted Successfully`,
                });
                fetchDiseases();
                setOpenDialog(false);
                setEditingDisease(null);
            } else {
                toast({
                    description: `Error Deleting Disease`,
                });
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
        setConfirmationModalOpen(false);
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Disease</h1>
                </div>
                <Button
                    onClick={() => setOpenDialog(true)}
                    className="w-10 md:w-auto gap-1"
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add New Disease
                    </span>
                </Button>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        List of mango diseases
                    </CardDescription>
                </CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <div className="relative h-10 flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search disease..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`gap-1 w-10 md:w-auto ${
                                        filterStatus != 0 && "border-primary"
                                    }`}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        {filterStatus == 1
                                            ? "Active"
                                            : filterStatus == 2
                                            ? "Inactive"
                                            : "Filter"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>
                                    Filter by:{" "}
                                </DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 0}
                                    onCheckedChange={() => setFilterStatus(0)}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 1}
                                    onCheckedChange={() => setFilterStatus(1)}
                                >
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 2}
                                    onCheckedChange={() => setFilterStatus(2)}
                                >
                                    Inactive
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="gap-1 w-10 md:w-auto"
                                >
                                    <ArrowDownUp className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        {sortBy}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Sort by: </DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                    checked={sortBy == "Newest"}
                                    onCheckedChange={() => {
                                        setSortBy("Newest");
                                    }}
                                >
                                    Newest to oldest
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={sortBy == "Oldest"}
                                    onCheckedChange={() => {
                                        setSortBy("Oldest");
                                    }}
                                >
                                    Oldest to newest
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            className="w-10 md:w-auto gap-1"
                        >
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>
                </div>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Description
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Added Date
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton/>
                                ) : filteredDiseases &&
                                  filteredDiseases.length > 0 ? (
                                    filteredDiseases.map((disease) => (
                                        <TableRow key={disease.diseaseID}>
                                            <TableCell>
                                                {disease.diseaseName}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {disease.description}
                                            </TableCell>
                                            <TableCell>
                                                {disease.status == 1
                                                    ? "Active"
                                                    : "Inactive"}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {format(
                                                    disease.addedAt,
                                                    "MMM dd, yyyy p"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ActionMenu
                                                    diseaseID={
                                                        disease.diseaseID
                                                    }
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
                                            No diseases found.{" "}
                                            {searchTerm &&
                                                "Try adjusting your search."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DiseaseModal
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    editingDisease={editingDisease}
                    setEditingDisease={setEditingDisease}
                    fetchDiseases={fetchDiseases}
                />
                <ConfirmationModal
                    open={confirmationModalOpen}
                    onClose={setConfirmationModalOpen}
                    onConfirm={handleConfirmDelete}
                    title="Are you sure?"
                    content="This action cannot be undone."
                />
            </PageWrapper>
        </>
    );
}
interface ActionMenuProps {
    diseaseID: number;
    handleAction: (action: string, diseaseID: number) => void;
}
function ActionMenu({ diseaseID, handleAction }: ActionMenuProps) {
    const pathname = usePathname();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`${pathname}/${diseaseID}`}>
                    <DropdownMenuItem>
                        <FileImage className="mr-2 h-4 w-4" />
                        View Images
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleAction("Edit", diseaseID)}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleAction("Delete", diseaseID)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}