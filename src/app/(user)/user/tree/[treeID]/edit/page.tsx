"use client";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// UI Components
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { ArrowLeft, TreeDeciduous } from "lucide-react";

// Custom Components
import ConfirmationModal from "@/components/modal/confirmation-modal";

// Contexts
import { useAuth } from "@/context/auth-context";
import { useCameraContext } from "@/context/camera-context";

// Utils
import { toast } from "@/hooks/use-toast";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tree } from "@/types/types";
import React from "react";
import {
    getTreeByID,
    updateTreeByID,
} from "@/stores/tree";
import { moveToTrash } from "@/stores/trash";
import { set } from "date-fns";

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

type EditTree = Tree & { imagesLength?: number; treeImage?: string };

export default function Page({
    params,
}: {
    params: Promise<{ treeID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { treeID } = unwrappedParams;
    const [editTree, setEditTree] = useState<EditTree | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [imgsrc, setImgsrc] = useState<string | null>(null);
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

    const fetchTree = useCallback(async () => {
        setLoading(true);
        try {
            const tree = await getTreeByID(treeID);
            if (tree) {
                form.reset({
                    treeCode: tree.treeCode,
                    description: tree.description || "",
                    status: tree.status === 1 ? "Active" : "Inactive",
                    treeImage: tree.treeImage || "",
                });
                setImgsrc(tree.treeImage);
                setEditTree(tree);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    }, [treeID, form]);

    useEffect(() => {
        if (treeID && userInfo?.userID) {
            fetchTree();
        }
    }, [userInfo, treeID, fetchTree]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            form.setValue("treeImage", e.target?.result as string);
            setImgsrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        if (!editTree?.treeID) return;
        try {
            const res = await updateTreeByID(
                editTree.treeID,
                values.treeCode,
                values.description,
                values.status,
                values.treeImage
            );
            toast({
                title: res.success ? "Tree Updated" : "Failed to Update Tree",
                description: res.message,
            });
            setEditTree({
                ...editTree,
                treeCode: values.treeCode,
                description: values.description,
                status: values.status === "Active" ? 1 : 2,
                treeImage: values.treeImage,
            });
        } catch (error) {
            console.log(error);
            setError("Failed to add tree. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setConfirmationModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!editTree) return null;
            const res = await moveToTrash(editTree?.treeID,1);
            if (res.success) {
                toast({
                    title: `Tree Move to trash`,
                    description: res.message,
                });
                setConfirmationModalOpen(false);
                router.back()
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
    };
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">Edit Tree: {editTree?.treeCode}</h1>
                </div>
            </div>
            {loading || !editTree ? (
                <div className="min-h-screen w-full flex items-center justify-center">
                    loading
                </div>
            ) : (
                <PageWrapper>
                    <CardHeader className="p-0">
                        <CardDescription>
                            Edit Tree information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col md:flex-row gap-8"
                            >
                                <div className="w-full md:w-1/3 ">
                                    <FormField
                                        control={form.control}
                                        name="treeImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Tree Image (optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center gap-4">
                                                        <Avatar className="w-48 md:w-4/6 h-auto aspect-square items-start">
                                                            <AvatarImage
                                                                src={
                                                                    field.value
                                                                }
                                                                alt="Profile picture"
                                                            />
                                                            <AvatarFallback className="bg-primary/10">
                                                                <TreeDeciduous className="h-16 w-16 text-primary" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative flex items-center w-full">
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
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button type="button">
                                                                            {field.value
                                                                                ? "Change"
                                                                                : "Upload"}
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <Label htmlFor="avatar-upload">
                                                                            <DropdownMenuItem className="h-10">
                                                                                Select
                                                                            </DropdownMenuItem>
                                                                        </Label>
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
                                    />
                                </div>
                                <div className="w-full md:w-2/3 space-y-6">
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
                                                    A unique identifier for the
                                                    tree (e.g., TR001)
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={`${
                                                                field.value ===
                                                                "Active"
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
                                    {error && (
                                        <p
                                            className="text-sm text-red-500"
                                            role="alert"
                                        >
                                            {error}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-2 md:gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="text-red-500"
                                            onClick={handleDelete}
                                        >
                                            Move to trash
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBack}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                loading ||
                                                ( imgsrc === editTree.treeImage &&
                                                form.getValues().treeCode === editTree.treeCode &&
                                                form.getValues().description === editTree.description &&
                                                (form.getValues().status === "Active" ? 1 : 2) === editTree.status)
                                            }
                                        >
                                            {loading
                                                ? "updating..."
                                                : "Update Tree"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </PageWrapper>
            )}
            <ConfirmationModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Are you sure you want to delete tree ${
                    editTree?.treeCode ?? "Unknown"
                } ?`}
                content={`This action cannot be undone. The tree contains ${
                    editTree?.imagesLength || 0
                } image(s).`}
            />
        </>
    );
}
