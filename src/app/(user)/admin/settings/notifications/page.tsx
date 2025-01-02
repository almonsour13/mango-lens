'use client'

import { useState } from 'react'
import { Card,   CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

export default function NotificationsSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [notificationFrequency, setNotificationFrequency] = useState("daily")
    const [customMessage, setCustomMessage] = useState("")
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
                    <CardTitle>Notification Channels</CardTitle>
                    <CardDescription>
                        Choose how you want to receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                        <label
                            htmlFor="email-notifications"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable Email Notifications
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                        />
                        <label
                            htmlFor="sms-notifications"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable SMS Notifications
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Notification Channels")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Notification Frequency</CardTitle>
                    <CardDescription>
                        Set how often you want to receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select notification frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Notification Frequency")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Custom Notification Message</CardTitle>
                    <CardDescription>
                        Set a custom message to be included in notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Enter your custom notification message here..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Custom Message")}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}