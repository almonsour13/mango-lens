export function convertBlobToBase64(imageData: string | null | Buffer): string | null {
    if (!imageData) return null;
    if (Buffer.isBuffer(imageData)) {
        return `data:image/jpeg;base64,${imageData.toString('base64')}`;
    }
    const parsedObject  = JSON.parse(imageData.toString())
    const dataArray = parsedObject.data; 
    const bufferFromData = Buffer.from(dataArray);
    return `data:image/jpeg;base64,${bufferFromData.toString('base64')}`;
}

export function convertImageToBlob(imageData:string){
    return Buffer.from(imageData.split(",")[1], 'base64');
}