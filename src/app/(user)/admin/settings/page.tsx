'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'

export default function GeneralSettings() {
  const [systemName, setSystemName] = useState("Mango Health System")
  const [imageDirectory, setImageDirectory] = useState("/uploads/images")
  const [allowAdminChange, setAllowAdminChange] = useState(true)
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [systemDescription, setSystemDescription] = useState("AI-powered mango disease detection and management system.")
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
          <CardTitle>System Name</CardTitle>
          <CardDescription>
            The name of your Mango Health System instance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="System Name" 
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave("System Name")}>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Upload Directory</CardTitle>
          <CardDescription>
            The directory where mango leaf images are stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Image Directory"
              value={imageDirectory}
              onChange={(e) => setImageDirectory(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allow-admin-change" 
                  checked={allowAdminChange}
                  onClick={()=>setAllowAdminChange(!allowAdminChange)}
              />
              <label
                htmlFor="allow-admin-change"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow administrators to change the directory.
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave("Image Directory")}>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Language</CardTitle>
          <CardDescription>
            Set the default language for the Mango Health System.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave("System Language")}>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Description</CardTitle>
          <CardDescription>
            Provide a brief description of your Mango Health System instance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="System Description" 
            value={systemDescription}
            onChange={(e) => setSystemDescription(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave("System Description")}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}