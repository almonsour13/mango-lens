'use client'

import { useState } from 'react'
import Link from "next/link"
import { useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormData = {
  email: string
}

export default function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            
            if (response.ok) {
                setSuccess('Password reset instructions have been sent to your email.')
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
                <Card className="mx-auto w-full max-w-md border-0 bg-transparent">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we will send you instructions to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email:</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    onChange={() => {
                                        setError(null)
                                        setSuccess(null)
                                    }}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500" role="alert">{errors.email.message}</p>
                                )}
                            </div>
                            {error && (
                                <p className="text-sm text-red-500" role="alert">{error}</p>
                            )}
                            {success && (
                                <p className="text-sm text-green-500" role="status">{success}</p>
                            )}
                            <Button type="submit" className="w-full bg-primary" disabled={loading}>
                                {loading ? "Sending..." : "Reset Password"}
                            </Button>
                            <div className="mt-4 text-center text-sm">
                                Remember your password?{" "}
                                <Link href="/signin" className="underline">
                                    Back to signin  
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}