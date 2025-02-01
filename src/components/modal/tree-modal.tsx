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
import { addTree } from "@/stores/tree";

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
    treeID: string;
    userID: string;
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
    handleTreeAction: (value: Tree) => void;
}

export default function TreeModal({
    openDialog,
    setOpenDialog,
    handleTreeAction,
}: TreeModalProps) {
    const [isLoading, setIsLoading] = useState(false);
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

    useEffect(() => {
        form.reset({
            treeCode: "",
            status: "Active",
            description: "",
            treeImage: "",
        });
    }, [openDialog, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const res = await addTree(
                values.treeCode,
                values.description,
                values.treeImage
            );
            toast({
                title: res.success ? "Tree Added" : "Failed to Add Tree",
                description: res.message,
            });
            if (res.success) {
                handleTreeAction(
                   res.data
                );
                form.reset();
            }
            setOpenDialog(false);
        } catch (err) {
            console.error(err);
        } finally {
            setOpenDialog(false);
            setIsLoading(false);
            setError("");
        }
    };

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
                        {error && (
                            <p className="text-sm text-destructive" role="alert">
                                {error}
                            </p>
                        )}
                        <div className="flex justify-end gap-2 md:gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Adding..." : "Add Tree"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </ScrollArea>
        </ModalDrawer>
    );
}
