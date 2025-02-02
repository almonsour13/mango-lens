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
    const tokenParams = search.get("token");
    const [token, setToken] = useState("");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const verifyEmail = useCallback(async () => {
        if (!email || !value || isVerifying || !token) return;

        setError("");
        setIsVerifying(true);
        setResendSuccess(false);
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
                setError(data.message);
                if (data.redirect) {
                    router.push(data.redirect);
                }
            }
        } catch (err) {
            setError(
                "An error occurred during verification. Please try again."
            );
            setValue("");
        } finally {
            setIsVerifying(false);
            setValue("");
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
        setResendSuccess(false);
        setError("");

        try {
            const res = await fetch(`/api/auth/verify/resend-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token }),
            });

            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                router.replace(data.url);
                setResendSuccess(true);
            } else {
                setError(data.message);
                if (data.redirect) {
                  router.replace(data.redirect) // Changed from push to replace
                }
            }
        } catch (err) {
            setError(
                "An error occurred while resending the code. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        if (tokenParams) {
            setToken(tokenParams);
        }
    }, [tokenParams]);

    return (
        <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">
                    Email Verification
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
                        Verifying your email...
                    </p>
                )}
                {resendSuccess && (
                    <p className="text-sm text-green-500" role="status">
                        A new verification code has been sent to your email.
                    </p>
                )}
                <div className="text-sm text-muted-foreground text-center">
                    Haven't received the code?{" "}
                    <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? "Sending..." : "Resend code"}
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
                <Suspense fallback={<div>Loading verification form...</div>}>
                    <VerifyForm />
                </Suspense>
            </div>
        </div>
    );
}
