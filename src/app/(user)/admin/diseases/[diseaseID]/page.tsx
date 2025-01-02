'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Edit, MoreHorizontal, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import PageWrapper from '@/components/wrapper/page-wrapper'

interface DiseaseImage {
  id: number
  url: string
  name: string
  uploadDate: string
}

interface Disease {
  id: number
  name: string
  description: string
  severityLevel: 'Mild' | 'Moderate' | 'Severe'
  images: DiseaseImage[]
}

export default function DiseaseImagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [viewImageDialogOpen, setViewImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<DiseaseImage | null>(null)

  // Mock data for demonstration
  const disease: Disease = {
    id: 1,
    name: "Mango Leaf Hoppers",
    description: "Insect pests that cause curling and yellowing of leaves.",
    severityLevel: "Moderate",
    images: Array(8).fill(null).map((_, index) => ({
      id: index + 1,
      url: "/placeholder.svg",
      name: `Image ${index + 1}`,
      uploadDate: "2023-06-15"
    }))
  }

  const handleUpload = async () => {
    if (!uploadFile) return
    // Implement upload logic here
    toast({
      title: "Success",
      description: "Image uploaded successfully.",
    })
    setUploadDialogOpen(false)
  }

  const handleEdit = () => {
    // Implement edit logic here
    toast({
      title: "Edit Disease",
      description: "Redirecting to edit page...",
    })
  }
  const handleViewImage = (image: DiseaseImage) => {
    setSelectedImage(image)
    setViewImageDialogOpen(true)
  }

  return (
    <PageWrapper>
      <div className="">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/diseases')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Diseases
        </Button>
      </div>
      <CardHeader className="border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{disease.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{disease.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {disease.severityLevel}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Disease
            </Button>
          </div>
        </div>
      </CardHeader>
        
      <div className="w-full flex items-center justify-between">
        <h2 className="text-xl font-semibold">Disease Images</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
              <DialogDescription>
                Select an image file to upload for this disease.
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
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {disease.images.map((image) => (
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
                        <h3 className="font-semibold text-sm text-white">{image.name}</h3>
                        <p className="text-xs text-white/80">{image.uploadDate}</p>
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
                          <DropdownMenuItem>Download</DropdownMenuItem>
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
        <DialogContent>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}