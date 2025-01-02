'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

export default function SecuritySettings() {
    const [passwordMinLength, setPasswordMinLength] = useState(8)
    const [twoFactorAuth, setTwoFactorAuth] = useState(false)
    const [sessionTimeout, setSessionTimeout] = useState("30")
    const [loginAttempts, setLoginAttempts] = useState(5)
    const {toast} = useToast();
    const handleSave = (section: string) => {
        toast({
            title: "Settings Saved",
            description: `${section} settings have been updated successfully.`,
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Password Policy</CardTitle>
                    <CardDescription>
                        Set the minimum requirements for user passwords.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="password-length" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Minimum Password Length
                        </label>
                        <Input
                            id="password-length"
                            type="number"
                            value={passwordMinLength}
                            onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                            min={6}
                            max={20}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Password Policy")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Enable or disable two-factor authentication for all users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="two-factor"
                            checked={twoFactorAuth}
                            onCheckedChange={setTwoFactorAuth}
                        />
                        <label
                            htmlFor="two-factor"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Require Two-Factor Authentication
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Two-Factor Authentication")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                    <CardDescription>
                        Configure session timeout and login attempt limits.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="session-timeout" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Session Timeout (minutes)
                        </label>
                        <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                            <SelectTrigger id="session-timeout">
                                <SelectValue placeholder="Select timeout duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="login-attempts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Max Login Attempts Before Lockout
                        </label>
                        <Input
                            id="login-attempts"
                            type="number"
                            value={loginAttempts}
                            onChange={(e) => setLoginAttempts(parseInt(e.target.value))}
                            min={3}
                            max={10}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Session Management")}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}