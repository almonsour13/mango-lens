'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast'

export default function IntegrationsSettings() {
    const [weatherApiKey, setWeatherApiKey] = useState("")
    const [weatherApiEnabled, setWeatherApiEnabled] = useState(false)
    const [mlModelEndpoint, setMlModelEndpoint] = useState("")
    const [mlModelEnabled, setMlModelEnabled] = useState(true)
    const [notificationWebhook, setNotificationWebhook] = useState("")
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
                    <CardTitle>Weather API Integration</CardTitle>
                    <CardDescription>
                        Configure the weather API for environmental data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="weather-api-key" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Weather API Key
                        </label>
                        <Input
                            id="weather-api-key"
                            type="password"
                            value={weatherApiKey}
                            onChange={(e) => setWeatherApiKey(e.target.value)}
                            placeholder="Enter your Weather API key"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="weather-api-enabled"
                            checked={weatherApiEnabled}
                            onCheckedChange={setWeatherApiEnabled}
                        />
                        <label
                            htmlFor="weather-api-enabled"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable Weather API Integration
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Weather API")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Machine Learning Model Integration</CardTitle>
                    <CardDescription>
                        Configure the endpoint for the mango disease detection ML model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="ml-model-endpoint" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            ML Model Endpoint
                        </label>
                        <Input
                            id="ml-model-endpoint"
                            type="url"
                            value={mlModelEndpoint}
                            onChange={(e) => setMlModelEndpoint(e.target.value)}
                            placeholder="https://api.example.com/ml-model"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="ml-model-enabled"
                            checked={mlModelEnabled}
                            onCheckedChange={setMlModelEnabled}
                        />
                        <label
                            htmlFor="ml-model-enabled"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable ML Model Integration
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("ML Model")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Notification Webhook</CardTitle>
                    <CardDescription>
                        Set up a webhook for sending notifications to external systems.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="notification-webhook" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Webhook URL
                        </label>
                        <Input
                            id="notification-webhook"
                            type="url"
                            value={notificationWebhook}
                            onChange={(e) => setNotificationWebhook(e.target.value)}
                            placeholder="https://api.example.com/webhook"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Notification Webhook")}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}