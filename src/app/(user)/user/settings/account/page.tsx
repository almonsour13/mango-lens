"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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
import { useAuth } from "@/context/auth-context";
import { Separator } from "@/components/ui/separator";
import { updateUserCredentials } from "@/utils/indexedDB/store/user-info-store";

const formSchema = z
    .object({
        email: z.string().email({ message: "Invalid email address." }),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmNewPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            if (
                (data.currentPassword && data.currentPassword.trim() !== "") ||
                (data.newPassword && data.newPassword.trim() !== "") ||
                (data.confirmNewPassword &&
                    data.confirmNewPassword.trim() !== "")
            ) {
                if (
                    !data.currentPassword ||
                    !data.newPassword ||
                    !data.confirmNewPassword
                ) {
                    return false;
                }
                if (data.newPassword.length < 8) {
                    return false;
                }
                return data.newPassword === data.confirmNewPassword;
            }
            return true;
        },
        {
            message:
                "Please fill all password fields and ensure new passwords match and are at least 8 characters long.",
            path: ["newPassword"],
        }
    );

export default function AccountSettings() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { userInfo } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            form.reset({
                email: userInfo?.email || "",
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        };

        if (userInfo?.userID) {
            fetchUser();
        }
    }, [userInfo?.userID]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        const payLoad = {
            type: 2,
            email: values.email,
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        };
        try {
            // Simulate API call
            const response = await fetch(`/api/user/${userInfo?.userID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payLoad),
            });

            const data = await response.json();
            if (response.ok) {
                if (userInfo?.userID) {
                    const userData = {
                        fName: userInfo?.fName,
                        lName: userInfo?.lName,
                        email: values.email,
                        profileImage: userInfo.profileImage,
                    };
                    await updateUserCredentials(userInfo?.userID, userData);
                }
            } else {
                if (data.error === "Incorrect Password") {
                    form.setError("currentPassword", {
                        type: "manual",
                        message: "Current password is incorrect",
                    });
                } else {
                    setError(data.error);
                }
                setLoading(false);
            }
        } catch (err) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    }

    // async function handleDeleteAccount() {
    //     setLoading(true);
    //     try {
    //         // Simulate API call
    //         await new Promise((resolve) => setTimeout(resolve, 2000));
    //         // Handle account deletion here
    //     } catch (err) {
    //         setError("An error occurred while deleting your account.");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <div className="space-y-6">
            <Card className="border-0">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="max-w-xl"
                    >
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your email and password settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <CardTitle className="text-xl mb-2">
                                    Email Address
                                </CardTitle>
                                <CardDescription className="mb-4">
                                    Change the email address associated with
                                    your account.
                                </CardDescription>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <CardTitle className="text-xl mb-2">
                                    Change Password
                                </CardTitle>
                                <CardDescription className="mb-4">
                                    Update your password to keep your account
                                    secure.
                                </CardDescription>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Current Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            type={
                                                                showCurrentPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() =>
                                                                setShowCurrentPassword(
                                                                    !showCurrentPassword
                                                                )
                                                            }
                                                            aria-label={
                                                                showCurrentPassword
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            {showCurrentPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            type={
                                                                showNewPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() =>
                                                                setShowNewPassword(
                                                                    !showNewPassword
                                                                )
                                                            }
                                                            aria-label={
                                                                showNewPassword
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            {showNewPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmNewPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            type={
                                                                showConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword
                                                                )
                                                            }
                                                            aria-label={
                                                                showConfirmPassword
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        {error && (
                            <p className="text-sm text-red-500 mt-2 text-center">
                                {error}
                            </p>
                        )}
                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    loading ||
                                    (form.getValues().email ===
                                        userInfo?.email &&
                                        !form.getValues().currentPassword &&
                                        !form.getValues().newPassword &&
                                        !form.getValues().confirmNewPassword)
                                }
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
            <Separator className="max-w-xl" />
            <Card className="border-0 max-w-xl">
                <CardHeader>
                    <CardTitle>Deactivate Account</CardTitle>
                    <CardDescription>
                        Temporarily disable your account. You can reactivate it
                        later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Deactivating your account will hide your profile and
                        content from other users. You can reactivate your
                        account at any time by logging in.
                    </p>
                </CardContent>
                <div className="w-full flex justify-end">
                    <Button variant="outline">Deactivate Account</Button>
                </div>
            </Card>
            <Separator className="max-w-xl"/>
            <Card className="border-0 max-w-xl">
                <CardHeader>
                    <CardTitle>Delete Account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back.
                        Please be certain.
                    </p>
                </CardContent>
                <div className="w-full flex justify-end">
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </Card>
        </div>
    );
}
