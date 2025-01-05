"use client";

import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    File,
    PlusCircle,
    Edit,
    Eye,
    SlidersHorizontal,
    ArrowDownUp,
    MoreVertical,
} from "lucide-react";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import UserModal from "@/components/modal/user-modal";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User } from "@/type/types";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";

export default function Users() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { userInfo } = useAuth();
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [userInfo?.userID]);

    const handleAction = async (action: string, userID: number) => {
        if (action === "Edit") {
            const user = users.filter((user) => user.userID == userID);
            setEditingUser(user[0]);
            setOpenDialog(true);
        }
    };
    const filteredUsers = users
        .filter((user) => {
            const nameMatch = (user.fName + " " + user.lName)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const emailMatch = user.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const statusMatch =
                filterStatus === 0 || user.status === filterStatus;
            return (nameMatch || emailMatch) && statusMatch;
        })
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            } else {
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
            }
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleChangeStatus = (status: string, userID: number) => {
        setUsers(
            users.map((user) =>
                user.userID === userID
                    ? {
                          ...user,
                          status: status === "Active" ? 1 : 2,
                      }
                    : user
            )
        );
        toast({
            title: `Status Changed`,
            description: `User ID ${userID} Status changed to ${status}`,
        });
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">User</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setOpenDialog(true)}
                        className="w-10 md:w-auto gap-1"
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add New User
                        </span>
                    </Button>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Manage your users and view their account details.
                    </CardDescription>
                </CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <div className="relative h-10 flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
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
                                        Email
                                    </TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="hidden md:table-cell text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created At
                                    </TableHead>
                                    <TableHead className="text-right md:text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton />
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.userID}>
                                            {/* <TableCell>{indexOfFirstItem + index + 1}</TableCell> */}
                                            <TableCell>
                                                {user.fName + " " + user.lName}{" "}
                                                <span className="text-muted-foreground">
                                                    {userInfo?.userID ===
                                                        user.userID && "(you)"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                {user.role == 1
                                                    ? "Admin"
                                                    : "User"}
                                            </TableCell>
                                            <TableCell className="hidden md:flex justify-center">
                                                <Select
                                                    value={
                                                        user.status == 1
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    onValueChange={(value) =>
                                                        handleChangeStatus(
                                                            value,
                                                            user.userID
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-10 w-24 ${
                                                            user.status === 1
                                                                ? " text-green-500"
                                                                : " text-yellow-500"
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="Select tree code" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            className="text-green-500"
                                                            value="Active"
                                                        >
                                                            Active
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="text-yellow-500"
                                                            value="Inactive"
                                                        >
                                                            Inactive
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {format(
                                                    user.createdAt,
                                                    "MMM dd, yyyy p"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ActionMenu
                                                    userID={user.userID}
                                                    handleAction={handleAction}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <UserModal
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    fetchUsers={fetchUsers}
                />
            </PageWrapper>
        </>
    );
}
interface ActionMenuProps {
    userID: number;
    handleAction: (action: string, userID: number) => void;
}
function ActionMenu({ userID, handleAction }: ActionMenuProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/admin/users/${userID}`}>
                    <DropdownMenuItem
                        onClick={() => router.push(`/admin/users/${userID}`)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => handleAction("Edit", userID)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
const TableSkeleton = () => {
    return (
        <>
            {Array(5)
                .fill(0)
                .map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right md:text-center">
                            <Skeleton className="h-8 w-8 rounded-full inline-block" />
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );
};
