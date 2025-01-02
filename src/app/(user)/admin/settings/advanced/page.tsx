'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast'

export default function AdvancedSettings() {
    const [debugMode, setDebugMode] = useState(false)
    const [apiRateLimit, setApiRateLimit] = useState("100")
    const [customCssUrl, setCustomCssUrl] = useState("")
    const [maintenanceMode, setMaintenanceMode] = useState(false)
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
                    <CardTitle>Debug Mode</CardTitle>
                    <CardDescription>
                        Enable or disable debug mode for advanced troubleshooting.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="debug-mode"
                            checked={debugMode}
                            onCheckedChange={setDebugMode}
                        />
                        <label
                            htmlFor="debug-mode"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable Debug Mode
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Debug Mode")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>API Rate Limiting</CardTitle>
                    <CardDescription>
                        Set the maximum number of API requests per minute.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="api-rate-limit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            API Rate Limit (requests per minute)
                        </label>
                        <Input
                            id="api-rate-limit"
                            type="number"
                            value={apiRateLimit}
                            onChange={(e) => setApiRateLimit(e.target.value)}
                            min={10}
                            max={1000}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("API Rate Limiting")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Custom CSS</CardTitle>
                    <CardDescription>
                        Add a custom CSS file to modify the system appearance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="custom-css-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Custom CSS URL
                        </label>
                        <Input
                            id="custom-css-url"
                            type="url"
                            value={customCssUrl}
                            onChange={(e) => setCustomCssUrl(e.target.value)}
                            placeholder="https://example.com/custom.css"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Custom CSS")}>Save</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Mode</CardTitle>
                    <CardDescription>
                        Enable maintenance mode to temporarily disable the system for updates.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="maintenance-mode"
                            checked={maintenanceMode}
                            onCheckedChange={setMaintenanceMode}
                        />
                        <label
                            htmlFor="maintenance-mode"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Enable Maintenance Mode
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSave("Maintenance Mode")}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}