'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import * as SliderPrimitive from '@radix-ui/react-slider'

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCropCancel: () => void
}

export default function ImageCropper({ image, onCropComplete, onCropCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imageRef = useRef<HTMLImageElement>(null)

  const [scale, setScale] = useState(1)
  const [minScale, setMinScale] = useState(1)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      const aspect = width / height
      setMinScale(aspect > 1 ? naturalWidth / 1024 : naturalHeight / 1024)
      setScale(minScale)
      setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 })
    }
  }, [minScale])
  const cropImage = useCallback(() => {
    if (imageRef.current && completedCrop) {
      const image = imageRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
  
      if (!ctx) {
        throw new Error('No 2d context')
      }
  
      // Scaling factors to convert crop dimensions to the original image dimensions
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const pixelRatio = window.devicePixelRatio || 1
  
      // Set the canvas width and height according to the actual crop dimensions and pixel ratio
      canvas.width = completedCrop.width * scaleX * pixelRatio
      canvas.height = completedCrop.height * scaleY * pixelRatio
  
      // Set the context scale to handle high-resolution displays
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = 'high'
  
      // Calculate the crop coordinates adjusted by the zoom (scale)
      const cropX = completedCrop.x * scaleX
      const cropY = completedCrop.y * scaleY
      const cropWidth = completedCrop.width * scaleX
      const cropHeight = completedCrop.height * scaleY
  
      // Adjust the crop area based on the current zoom (scale factor)
      const zoomedX = cropX / scale
      const zoomedY = cropY / scale
      const zoomedWidth = cropWidth / scale
      const zoomedHeight = cropHeight / scale
  
      // Draw the image on the canvas using the zoomed crop coordinates
      ctx.drawImage(
        image,
        zoomedX,           // Start X coordinate
        zoomedY,           // Start Y coordinate
        zoomedWidth,       // Width of the crop
        zoomedHeight,      // Height of the crop
        0,                 // Place the image at (0,0) on the canvas
        0,
        canvas.width,      // Canvas width to draw the image
        canvas.height      // Canvas height to draw the image
      )
  
      // Convert the canvas to a Blob and pass it back
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty')
            return
          }
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            onCropComplete(reader.result as string)
          }
        },
        'image/jpeg',
        1 // quality
      )
    }
  }, [completedCrop, scale, onCropComplete])
  

  return (
    <Dialog open={true} onOpenChange={onCropCancel}>
      <DialogContent className="w-full md:w-auto">
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
          <DialogDescription>
            Adjust the crop and click confirm when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-auto flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-lg">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
          <Image
            ref={imageRef}
            src={image}
            alt="Crop me"
            style={{ transform: `scale(${scale})`, maxHeight: '24rem' }}
            onLoad={onImageLoad}
            className="max-w-full w-auto h-auto max-h-96 rounded-md object-contain"
            objectFit='cover'
            height={1024}
            width={1024}
          />
          </ReactCrop>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <SliderPrimitive.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            min={minScale}
            max={3}
            step={0.01}
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
          >
            <SliderPrimitive.Track className="bg-muted relative flex-grow rounded-full h-2">
              <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className="block w-4 h-4 bg-primary shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="Zoom"
            />
          </SliderPrimitive.Root>
        </div>

        <DialogFooter className="flex-row justify-end">
          <Button type="button" variant="secondary" onClick={onCropCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={cropImage}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}