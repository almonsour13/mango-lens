"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    deleteUserCredentials,
    getUserCredentials,
    storeUserCredentials,
} from "@/utils/indexedDB/indexedDB";

export default function Verify() {
    const search = useSearchParams();
    const router = useRouter();
    const email = search.get("email");
    const token = search.get("token");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const verifyEmail = useCallback(async () => {
        setIsVerifying(true);
        setError("");
        try {
            if (!email || !value || isVerifying) return;

            const res = await fetch(`/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: value, token }),
            });
            console.log(value);
            const data = await res.json();

            if (res.ok) {
                const { user, redirect } = data
                if(await getUserCredentials(user.userID)){
                    await deleteUserCredentials(user.userID)
                }
                await storeUserCredentials(user);

                router.push(redirect)
            } else {
                setError(data.error || data.message || "Verification failed");
                return;
            }
        } catch (err) {
            setError((err as Error).message);
            setValue(""); 
        } finally {
            setIsVerifying(false);
        }
    }, [value, email, router]);

    useEffect(() => {
        if (value.length === 6) {
            verifyEmail();
        }
    }, [value, verifyEmail]);

    const handleResend = async () => {};

    return (
        <div className="w-full flex h-screen flex-row-reverse">
            <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md mx-auto border-0 bg-card shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-primary">
                            Verify Your Email
                        </CardTitle>
                        <CardDescription className="text-center">
                            Please enter the 6-digit verification code sent to{" "}
                            {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col justify-center items-center">
                        <InputOTP
                            maxLength={6}
                            value={value}
                            onChange={(value) => setValue(value)}
                            pattern={REGEXP_ONLY_DIGITS}
                            disabled={isVerifying}
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
                            <p className="text-sm text-blue-500">
                                Verifying...
                            </p>
                        )}
                        <div className="text-sm text-muted-foreground text-center">
                            {"Didn't"} receive the code?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto"
                                onClick={handleResend}
                            >
                                Resend
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
