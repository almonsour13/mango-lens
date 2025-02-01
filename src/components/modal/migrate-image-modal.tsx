"use client";
import { useEffect, useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ModalDrawer from "./modal-drawer-wrapper";
import { useAuth } from "@/context/auth-context";
import { Tree } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { getTreeByUser } from "@/stores/tree";
import { migrateImage } from "@/stores/image";

const formSchema = z.object({
    treeCode: z
        .string()
        .nonempty({ message: "You must select a treeCode to migrate." }),
});

interface EditModalProps {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    onMigrate: (treeID: string, newTreeCode: string) => void;
    initialData: { imageID: string; currentTreeCode: string };
}

export default function MigrateImageModal({
    openDialog,
    setOpenDialog,
    onMigrate,
    initialData,
}: EditModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trees, setTrees] = useState<Tree[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            treeCode: "",
        },
    });

    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchTrees = async () => {
            try {
                if (!userInfo?.userID) return;
                await new Promise((resolve) => setTimeout(resolve, 500));
                const res = await getTreeByUser();
                if (res.success) {
                    const treeData = res.data as Tree[];
                    setTrees(
                        treeData.filter(
                            (tree) =>
                                tree.treeCode !== initialData.currentTreeCode
                        )
                    );
                }
            } catch (error) {
                console.error("Error fetching trees:", error);
                setError("Failed to fetch trees. Please try again.");
            }
        };

        if (userInfo?.userID) {
            fetchTrees();
        }
    }, [userInfo?.userID, initialData.currentTreeCode]);

    useEffect(() => {
        if (openDialog) {
            form.reset({ treeCode: "" });
        }
    }, [openDialog, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);
        try {
            if (values.treeCode === initialData.currentTreeCode) {
                throw new Error(
                    "New tree code must be different from the current one"
                );
            }
            const res = await migrateImage(
                initialData.imageID,
                values.treeCode
            );
            if (res.success) {
                await onMigrate(res.data.treeID, values.treeCode);
                toast({
                    description: res.message,
                });
                setOpenDialog(false);
            }
        } catch (error) {
            console.error("Error migrating image:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to migrate image. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
            <DialogHeader>
                <DialogTitle>Migrate Image</DialogTitle>
                <DialogDescription>
                    Current TreeCode: {initialData.currentTreeCode}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="treeCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Tree</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a tree code to migrate" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {trees.length ? (
                                            trees.map((tree) => (
                                                <SelectItem
                                                    key={tree.treeID}
                                                    value={tree.treeCode}
                                                >
                                                    {tree.treeCode}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <p className="p-1 px-2">
                                                No trees available
                                            </p>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && (
                        <p className="text-sm text-red-500" role="alert">
                            {error}
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Migrating..." : "Migrate"}
                        </Button>
                    </div>
                </form>
            </Form>
        </ModalDrawer>
    );
}
