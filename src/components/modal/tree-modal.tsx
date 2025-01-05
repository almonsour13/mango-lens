import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// UI Components
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";

// Custom Components
import ModalDrawer from "./modal-drawer-wrapper";
import ConfirmationModal from "./confirmation-modal";

// Contexts
import { useAuth } from "@/context/auth-context";

import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    treeCode: z
        .string()
        .min(2, { message: "Tree code must be at least 2 characters." })
        .max(10, { message: "Tree code must not exceed 10 characters." }),
    status: z.enum(["Active", "Inactive"], {
        required_error: "Please select a Status.",
    }),
    description: z.string().or(z.literal("")),
    treeImage: z.string().optional(),
});
export interface Tree {
    treeID: number;
    userID: number;
    treeCode: string;
    description: string;
    status: number;
    addedAt: Date;
    imagesLength?: number;
    treeImage?: string;
}
interface TreeModalProps {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    editingTrees?:
        | {
              treeID: number;
              treeCode: string;
              description: string;
              imagesLength: number;
              status: number;
              treeImage?: string;
          }
        | null
        | Tree;
    setEditingTrees?: (
        value: {
            treeID: number;
            treeCode: string;
            description: string;
            imagesLength: number;
            status: number;
            treeImage?: string;
        } | null
    ) => void | null;
    handleTreeAction?: (value: Tree, action: number, status?: number) => void;
    handleSetNewTreeCode?: (value: string) => void;
}

export default function TreeModal({
    openDialog,
    editingTrees,
    setOpenDialog,
    setEditingTrees,
    handleTreeAction,
    handleSetNewTreeCode,
}: TreeModalProps) {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            treeCode: "",
            status: "Active",
            description: "",
            treeImage: "",
        },
    });

    const { userInfo } = useAuth();

    useEffect(() => {
        if (editingTrees) {
            form.reset({
                treeCode: editingTrees.treeCode,
                status: editingTrees.status == 1 ? "Active" : "Inactive",
                description: editingTrees.description || "",
            });
        } else {
            form.reset({
                treeCode: "",
                status: "Active",
                description: "",
                treeImage: "",
            });
        }
        if (!openDialog) {
            setEditingTrees && setEditingTrees(null);
        }
    }, [editingTrees, openDialog, setEditingTrees]);

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `/api/user/${userInfo?.userID}/trash`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ treeID: editingTrees?.treeID }),
                }
            );

            const result = await response.json();

            if (result.success) {
                toast({
                    title: `Tree Move to trash`,
                    description: `Move to Trash action performed on tree ${editingTrees?.treeID}`,
                });
                setOpenDialog(false);
                const tree = editingTrees as Tree;
                handleTreeAction && handleTreeAction(tree, 3);

                setEditingTrees && setEditingTrees(null);
                setConfirmationModalOpen(false);
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
    };

    const handleDelete = () => {
        setConfirmationModalOpen(true);
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const method = editingTrees ? "PUT" : "POST";
        const status = values.status == "Active" ? 1 : 2;
        const payload = editingTrees
            ? {
                  treeID: editingTrees.treeID,
                  treeCode: values.treeCode,
                  description: values.description,
                  status: status,
              }
            : values;

        try {
            const response = await fetch(
                `/api/user/${userInfo?.userID}/tree/`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (response.ok) {
                const tree = editingTrees as Tree;
                if (editingTrees) {
                    handleTreeAction &&
                        handleTreeAction(
                            {
                                ...values,
                                treeID: tree.treeID,
                                userID: userInfo?.userID ?? 0,
                                addedAt: tree.addedAt,
                                status: status,
                            },
                            2,
                            status
                        );
                } else {
                    handleTreeAction &&
                        handleTreeAction(
                            {
                                ...data.tree,
                            },
                            1
                        );
                }
                setOpenDialog(false);
                form.reset();
                setEditingTrees && setEditingTrees(null);
                handleSetNewTreeCode && handleSetNewTreeCode(values.treeCode);
                toast({
                    title: editingTrees ? "Tree Updated" : "Tree Added",
                    description: `Tree ${
                        editingTrees ? "updated" : "added"
                    } successfully.`,
                });
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setError("");
        }
    };

    // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             form.reset({
    //                 treeCode: form.getValues().treeCode,
    //                 status: form.getValues().status,
    //                 description: form.getValues().description,
    //                 treeImage: e.target?.result as string,
    //             });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    // const {setIsCameraOpen} = useCameraContext();
    return (
        <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
            <ScrollArea className="max-h-[calc(100vh-56px)]">
                <DialogHeader>
                    <DialogTitle>Add New Tree</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new tree to add it to the
                        monitoring system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* <FormField
                            control={form.control}
                            name="treeImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tree Image (optional)</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row gap-4 space-y-4">
                                            <Avatar className="w-32 h-32 items-start">
                                                <AvatarImage
                                                    src={field.value}
                                                    alt="Profile picture"
                                                />
                                                <AvatarFallback className="bg-primary/10">
                                                    <TreeDeciduous className="h-16 w-16 text-primary" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex items-center">
                                                    <Input
                                                        type="file"
                                                        id="avatar-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={
                                                            handleAvatarChange
                                                        }
                                                    />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button type="button">
                                                                {editingTrees &&
                                                                field.value
                                                                    ? "Change"
                                                                    : "Upload"}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                                <Label
                                                                    htmlFor="avatar-upload"
                                                                >
                                                            <DropdownMenuItem className="h-10">
                                                                    Select
                                                            </DropdownMenuItem>
                                                                </Label>
                                                            <DropdownMenuItem
                                                                className="h-10"
                                                               onClick={() => setIsCameraOpen(true)}
                                                            >
                                                                Camera
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                {field.value && (
                                                    <Button
                                                        variant="destructive"
                                                        type="button"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "treeImage",
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="treeCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tree Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter tree code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A unique identifier for the tree (e.g.,
                                        TR001)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tree Description(optional):
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter tree description"
                                            {...field}
                                            className="min-h-36"
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                    A unique identifier for the tree (e.g.,
                                    TR001)
                                </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {editingTrees && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className={`${
                                                        field.value == "Active"
                                                            ? "text-primary"
                                                            : "text-destructive"
                                                    }`}
                                                >
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value="Active"
                                                    className="text-primary"
                                                >
                                                    Active
                                                </SelectItem>
                                                <SelectItem
                                                    value="Inactive"
                                                    className="text-destructive"
                                                >
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {error && (
                            <p className="text-sm text-red-500" role="alert">
                                {error}
                            </p>
                        )}
                        <div className="flex justify-end gap-2 md:gap-4">
                            {editingTrees && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-red-500"
                                    onClick={handleDelete}
                                >
                                    Move to trash
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? editingTrees
                                        ? "Updating..."
                                        : "Adding..."
                                    : editingTrees
                                    ? "Update Tree"
                                    : "Add Tree"}
                            </Button>
                        </div>
                    </form>
                </Form>
                {editingTrees && (
                    <ConfirmationModal
                        open={confirmationModalOpen}
                        onClose={() => setConfirmationModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title={`Are you sure you want to delete tree ${
                            editingTrees?.treeCode ?? "Unknown"
                        } ?`}
                        content={`This action cannot be undone. The tree contains ${editingTrees.imagesLength} image(s).`}
                    />
                )}
            </ScrollArea>
        </ModalDrawer>
    );
}
