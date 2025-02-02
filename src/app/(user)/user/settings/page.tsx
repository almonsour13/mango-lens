"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCameraContext } from "@/context/camera-context";
import { getUser, updateUserInfo } from "@/stores/user-store";

const formSchema = z.object({
    profileImage: z.string().optional(),
    fName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters." })
        .nonempty({ message: "First name is required." }),
    lName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters." })
        .nonempty({ message: "Last name is required." }),
});
export default function ProfileSettings() {
    const {capturedImage, setCapturedImage, setIsCameraOpen} = useCameraContext();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const userInfo = getUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fName: "",
            lName: "",
            profileImage: "",
        },
    });

    useEffect(() => {
        if(capturedImage){
            form.reset({
                fName: form.getValues().fName,
                lName: form.getValues().lName,
                profileImage: capturedImage
            });
        }
    },[capturedImage, form])

    useEffect(() => {
        const fetchUser = async () => {
            form.reset({
                fName: userInfo?.fName || "",
                lName: userInfo?.lName || "",
                profileImage: userInfo?.profileImage || "",
            });
        };
        if (userInfo?.userID) {
            fetchUser();
        }
    }, [userInfo, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null)
        setLoading(true);
        const payLoad = {
            type: 1,
            fName: values.fName,
            lName: values.lName,
            imageData:
                (userInfo?.profileImage !== values.profileImage &&
                    values.profileImage) ||
                "",
        };
        

        try {
            await updateUserInfo(values.fName, values.lName)
            setLoading(false)
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "An error occurred"
            );
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                form.reset({
                    fName: form.getValues().fName,
                    lName: form.getValues().lName,
                    profileImage: e.target?.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-0">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Manage your personal information and profile picture.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="profileImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Profile Image (optional)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-row gap-4 space-y-4">
                                                <Avatar className="w-32 h-32 items-start">
                                                    <AvatarImage
                                                        src={field.value}
                                                        alt="Profile picture"
                                                    />
                                                    <AvatarFallback>
                                                        {form
                                                            .getValues()
                                                            .fName.charAt(0) +
                                                            " " +
                                                            form
                                                                .getValues()
                                                                .lName.charAt(
                                                                    0
                                                                )}
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
                                                        {/* <Label
                                                            htmlFor="avatar-upload"
                                                            className="w-full h-10 text-primary-foreground rounded-md flex items-center gap-2 px-4 py-2 bg-primary cursor-pointer"
                                                        >
                                                            
                                                            Change
                                                        </Label> */}
                                                        <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button type="button">
                                                                {
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
                                                                    "profileImage",
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
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="fName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {error && (
                                <p
                                    className="text-sm text-red-500"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}
                            <div className="w-full flex justify-end">
                                <Button
                                    type="submit"
                                    className=" bg-primary"
                                    disabled={
                                        loading ||
                                        (form.getValues().fName ===
                                            userInfo?.fName &&
                                            form.getValues().lName ===
                                                userInfo?.lName &&
                                            form.getValues().profileImage ===
                                                userInfo?.profileImage)
                                    }
                                >
                                    {loading ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
