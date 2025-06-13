import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import ModalDrawer from "./modal-drawer-wrapper";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { addFarm } from "@/stores/farm";
import { toast } from "@/hooks/use-toast";
import { Farm } from "@/types/types";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    farmName: z
        .string()
        .min(2, { message: "Farm name must be at least 2 characters." })
        .max(50, { message: "Farm name must not exceed 50 characters." }),
    address: z
        .string()
        .min(2, { message: "Location must be at least 2 characters." })
        .max(100, { message: "Location must not exceed 100 characters." }),
    description: z.string().optional(),
});
interface FarmProps extends Farm{
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    diseaseCount: {[diseaseName: string]: number},
    farmHealth: number;
}
interface AddFarmModalProps {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    farm: FarmProps[] | null;
    setFarm?: (farm: FarmProps[]) => void;
}
export default function AddFarmModal({
    openDialog,
    setOpenDialog,
    farm = null,
    setFarm
}: AddFarmModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            farmName: "",
            address: "",
            description: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);

        try {
            const res = await addFarm(
                values.farmName,
                values.address,
                values.description
            );
            if (res.success) {
                if (setFarm) {
                    setFarm([...(farm || []), res.data]);
                }
                router.push(`/user/scan/${res.data.farmID}`)
                toast({
                    title: "Farm Added",
                    description: "Your farm has been successfully created.",
                });
            }
            setOpenDialog(false);
        } catch (error) {
            console.log(error);
            setError("Failed to add farm. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
            <DialogHeader>
                <DialogTitle>Add new farm</DialogTitle>
                {/* <DialogDescription>Add farm information.</DialogDescription> */}
            </DialogHeader>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="farmName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Farm Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter farm name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A unique name for your farm (e.g., Sunny
                                    Acres)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter address"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The address of your farm (e.g., California,
                                    USA)
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
                                    Farm Description (optional)
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter farm description"
                                        {...field}
                                        className="min-h-36"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe your farm, what you grow, farming
                                    practices, etc.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <p className="text-sm text-red-500" role="alert">
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
                        <Button
                            type="submit"
                            disabled={
                                loading ||
                                !form.getValues().farmName ||
                                !form.getValues().address
                            }
                        >
                            {loading ? "Adding..." : "Add Farm"}
                        </Button>
                    </div>
                </form>
            </Form>
        </ModalDrawer>
    );
}
