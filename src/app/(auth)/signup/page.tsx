"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
    .object({
        fName: z
            .string()
            .min(2, { message: "First name must be at least 2 characters." })
            .nonempty({ message: "First name is required." }),
        lName: z
            .string()
            .min(2, { message: "Last name must be at least 2 characters." })
            .nonempty({ message: "Last name is required." }),
        email: z
            .string()
            .email({ message: "Please enter a valid email address." })
            .nonempty({ message: "Email is required." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." })
            .nonempty({ message: "Password is required." }),
        confirmPassword: z
            .string()
            .nonempty({ message: "Please confirm your password." }),
    })
    .required()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function SignupForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fName: "",
            lName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            
            const data = await response.json();
            if (response.ok) {
                router.push(data.url)
                console.log(data.url)
            } else {
                setError(
                    data.error || "An unexpected error occurred. Please try again.",
                );
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again." + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex h-screen flex-row-reverse">
            <div className="flex-1 hidden md:block bg-muted">
                <div className="flex items-center justify-center w-full h-full">
                    <Image
                        src="/assets/icon/icon.png"
                        alt="Login cover"
                        width={500}
                        height={500}
                        className="object-cover w-56 h-56"
                    />
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md mx-auto border-0 bg-transparent shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">
                            Sign Up
                        </CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    First Name
                                                </FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="johndoe@example.com"
                                                    {...field}
                                                    type="email"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Enter Password"
                                                        {...field}
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
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
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Confirm Password"
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
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword,
                                                            )
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
                                {error && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Logging in..."
                                        : "Create an account"}
                                </Button>
                                {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="signin" className="underline">
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
