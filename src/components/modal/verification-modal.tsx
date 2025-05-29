import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ModalDrawer from "./modal-drawer-wrapper";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useCallback, useEffect, useState } from "react";
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
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { getUser, setUser } from "@/stores/user-store";

interface VerificationModalProps {
    email: string;
    verificationCode:string;
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
}
export default function VerificationModal({
    email,
    verificationCode,
    openDialog,
    setOpenDialog,
}: VerificationModalProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const verifyEmail = useCallback(async () => {
        if (!email || !value || isVerifying) return;

        setError("");
        setIsVerifying(true);
        setResendSuccess(false);

        try {
            const res = await fetch(`/api/user/change-email/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: value, orgCode:verificationCode }),
            });

            const data = await res.json();

            if (res.ok) {
                setOpenDialog(false)
                
                const currentUser = getUser();
                if (currentUser) {
                    setUser({...currentUser, email: email});
                }
                toast({
                    description: "Email change sucessfully",
                    variant: "default",
                });
            } else {
                setError(data.message);
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
    }, [value, email, isVerifying]);

    useEffect(() => {
        if (value.length === 6 && !isVerifying) {
            verifyEmail();
        }
    }, [value, verifyEmail, isVerifying]);
    return (
        <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
            <DialogHeader>
                <DialogTitle>Email Verification</DialogTitle>
                <DialogDescription>
                    Please enter the 6-digit verification code sent to {email}
                </DialogDescription>
            </DialogHeader>

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
                    {"Haven't"} received the code?{" "}
                    <Button
                        variant="link"
                        className="p-0 h-auto"
                        // onClick={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? "Sending..." : "Resend code"}
                    </Button>
                </div>
            </CardContent>
        </ModalDrawer>
    );
}
