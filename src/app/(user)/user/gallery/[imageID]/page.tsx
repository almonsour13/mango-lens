import ImageDetails from "@/components/common/image-details"
import React, {useEffect, useState} from "react"

export default function Page({ params }: { params: Promise<{ imageID: string }> }) {
    const unwrappedParams = React.use(params)
    const { imageID } = unwrappedParams
    const id:number = parseInt(imageID)
    
    return <ImageDetails imageID={id} />
}