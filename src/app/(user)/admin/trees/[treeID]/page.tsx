'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Calendar, Edit, Leaf, MoreHorizontal, PlusCircle, Thermometer, Droplets, Wind } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageWrapper from '@/components/wrapper/page-wrapper'

interface LeafImage {
  id: number
  url: string
  name: string
  uploadDate: string
  diseaseStatus: 'Healthy' | 'Mild' | 'Moderate' | 'Severe'
}

interface MangoTree {
  id: number
  name: string
  age: number
  location: string
  healthStatus: 'Healthy' | 'Mild Concern' | 'Moderate Concern' | 'Severe Concern'
  lastInspection: string
  leafImages: LeafImage[]
}

interface HealthData {
  date: string
  leafHealth: number
  soilMoisture: number
  temperature: number
}

const healthData: HealthData[] = [
  { date: '2023-01', leafHealth: 95, soilMoisture: 60, temperature: 25 },
  { date: '2023-02', leafHealth: 92, soilMoisture: 58, temperature: 26 },
  { date: '2023-03', leafHealth: 88, soilMoisture: 55, temperature: 27 },
  { date: '2023-04', leafHealth: 85, soilMoisture: 52, temperature: 28 },
  { date: '2023-05', leafHealth: 80, soilMoisture: 50, temperature: 29 },
  { date: '2023-06', leafHealth: 78, soilMoisture: 48, temperature: 30 },
]

export default function MangoTreeDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [viewImageDialogOpen, setViewImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<LeafImage | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'leafHealth' | 'soilMoisture' | 'temperature'>('leafHealth')

  // Mock data for demonstration
  const mangoTree: MangoTree = {
    id: 1,
    name: "Mango Tree #1",
    age: 5,
    location: "Orchard Section A, Row 3",
    healthStatus: "Mild Concern",
    lastInspection: "2023-06-15",
    leafImages: Array(12).fill(null).map((_, index) => ({
      id: index + 1,
      url: "/placeholder.svg",
      name: `Leaf Sample ${index + 1}`,
      uploadDate: "2023-06-15",
      diseaseStatus: ['Healthy', 'Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 4)] as 'Healthy' | 'Mild' | 'Moderate' | 'Severe'
    }))
  }

  const handleUpload = async () => {
    if (!uploadFile) return
    // Implement upload logic here
    toast({
      title: "Success",
      description: "Leaf image uploaded successfully.",
    })
    setUploadDialogOpen(false)
  }

  const handleEdit = () => {
    // Implement edit logic here
    toast({
      title: "Edit Mango Tree",
      description: "Redirecting to edit page...",
    })
  }

  const handleViewImage = (image: LeafImage) => {
    setSelectedImage(image)
    setViewImageDialogOpen(true)
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500'
      case 'Mild Concern': return 'bg-yellow-500'
      case 'Moderate Concern': return 'bg-orange-500'
      case 'Severe Concern': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <PageWrapper>
    <div className="container mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push('/mango-trees')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mango Trees
        </Button>
      </div>
      <Card className="mb-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{mangoTree.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Age:</span> {mangoTree.age} years | 
                <span className="font-medium ml-2">Location:</span> {mangoTree.location}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`px-2 py-1 ${getHealthStatusColor(mangoTree.healthStatus)}`}>
                {mangoTree.healthStatus}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Tree Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tree Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Inspection: {mangoTree.lastInspection}</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Leaf Health: Good</span>
                </div>
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Average Temperature: 28°C</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Soil Moisture: Adequate</span>
                </div>
                <div className="flex items-center">
                  <Wind className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Wind Exposure: Moderate</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Health Trends</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Select value={selectedMetric} onValueChange={(value: 'leafHealth' | 'soilMoisture' | 'temperature') => setSelectedMetric(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leafHealth">Leaf Health</SelectItem>
                    <SelectItem value="soilMoisture">Soil Moisture</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey={selectedMetric} stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Leaf Samples</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Leaf Sample
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Leaf Sample</DialogTitle>
              <DialogDescription>
                Select a leaf image to upload for analysis.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
            <DialogFooter>
              <Button onClick={handleUpload} disabled={!uploadFile}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {mangoTree.leafImages.map((image) => (
              <div key={image.id} className="relative overflow-hidden rounded-lg aspect-square bg-muted">
                <Image
                  src={image.url}
                  alt={image.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-xs text-white">{image.name}</h3>
                        <p className="text-xs text-white/80">{image.uploadDate}</p>
                        <Badge variant="outline" className={`mt-1 text-xs ${getHealthStatusColor(image.diseaseStatus)}`}>
                          {image.diseaseStatus}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleViewImage(image)}>View</DropdownMenuItem>
                          <DropdownMenuItem>Analyze</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={viewImageDialogOpen} onOpenChange={setViewImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
            <DialogDescription>
              Uploaded on {selectedImage?.uploadDate}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-square w-full">
            {selectedImage && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.name}
                layout="fill"
                objectFit="contain"
              />
            )}
          </div>
          <div className="mt-4">
            <Badge variant="outline" className={`${getHealthStatusColor(selectedImage?.diseaseStatus || '')}`}>
              {selectedImage?.diseaseStatus}
            </Badge>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PageWrapper>
  )
}
