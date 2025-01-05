'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { deleteUserCredentials, getUserCredentials, storeUserCredentials } from '@/utils/indexedDB/store/user-info-store'

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." })
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            
            if (response.ok) {
                const { user, redirect } = await response.json()
                if(await getUserCredentials(user.userID)){
                    await deleteUserCredentials(user.userID)
                }
                await storeUserCredentials(user);

                router.push(redirect)
            } else {
                const { error } = await response.json()
                setError(error || 'An unexpected error occurred. Please try again.')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.'+err)
        } finally {
            setLoading(false)
        }
    }    

    return (
        <div className="w-full h-screen flex">
            <div className="flex-1 flex items-center justify-center">
                <Card className="mx-auto w-full max-w-md border-0 bg-transparent shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe@example.com" {...field} type="email"/>
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
                                                    type={showPassword ? "text" : "password"}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                <div className="flex items-center justify-end">
                                    <Link href="/forgot-password" className='text-primary'>
                                        forgot password
                                    </Link>
                                </div>
                                {error && (
                                    <p className="text-sm text-red-500" role="alert">{error}</p>
                                )}
                                <Button type="submit" className="w-full bg-primary" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="underline">
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
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
        </div>
    )
}