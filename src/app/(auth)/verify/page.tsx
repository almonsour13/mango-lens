"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { getUser, removeUser, setUser } from "@/stores/user-store";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function VerifyForm() {
    const search = useSearchParams();
    const router = useRouter();
    const email = search.get("email");
    const token = search.get("token");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const verifyEmail = useCallback(async () => {
        if (!email || !value || isVerifying) return;

        setError("");
        setIsVerifying(true);

        try {
            const res = await fetch(`/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: value, token }),
            });

            const data = await res.json();

            if (res.ok) {
                const { user, redirect } = data;
                if (getUser()) {
                    removeUser();
                }
                setUser(user);
                router.push(redirect);
            } else {
                throw new Error(
                    data.error || data.message || "Verification failed"
                );
            }
        } catch (err) {
            setError((err as Error).message);
            setValue("");
        } finally {
            setIsVerifying(false);
            setValue('')
        }
    }, [value, email, router, isVerifying, token]);

    useEffect(() => {
        if (value.length === 6 && !isVerifying) {
            verifyEmail();
        }
    }, [value, verifyEmail, isVerifying]);

    const handleResend = async () => {
        if (isResending || !email) return;

        setIsResending(true);
        setError("");

        try {
            const res = await fetch(`/api/auth/resend-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(
                    data.error || data.message || "Failed to resend code"
                );
            }

            // Show success message (you might want to add a state for this)
            console.log("Verification code resent successfully");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsResending(false);
        }
    };

    if (!email || !token) {
        return <div>Invalid verification link. Please request a new one.</div>;
    }

    return (
        <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">
                    Verify Your Email
                </CardTitle>
                <CardDescription className="text-center">
                    Please enter the 6-digit verification code sent to {email}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col justify-center items-center">
                <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value) => setValue(value)}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={isVerifying}
                    aria-label="Enter verification code"
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                {error && (
                    <p className="text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
                {isVerifying && (
                    <p className="text-sm text-blue-500" aria-live="polite">
                        Verifying...
                    </p>
                )}
                <div className="text-sm text-muted-foreground text-center">
                    {"Didn't"} receive the code?{" "}
                    <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? "Resending..." : "Resend"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Verify() {
    return (
        <div className="w-full flex h-screen flex-row-reverse">
            <div className="flex-1 flex items-center justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <VerifyForm />
                </Suspense>
            </div>
        </div>
    );
}
