export function convertBlobToBase64(imageData: string | null | Buffer): string | null {
    if (!imageData) return null;
    return `data:image/jpeg;base64,${Buffer.from(imageData).toString('base64')}`;
}

export function convertImageToBlob(imageData:string){
    return Buffer.from(imageData.split(",")[1], 'base64');
}