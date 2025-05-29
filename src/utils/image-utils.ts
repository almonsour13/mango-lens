export function convertBlobToBase64(imageData: string | null | Buffer): string | null {
    if (!imageData) return null;
    if (Buffer.isBuffer(imageData)) {
        return `data:image/jpeg;base64,${imageData.toString('base64')}`;
    }
    try {
        const parsedObject = JSON.parse(imageData.toString());
        if (!parsedObject.data) return null;
        const dataArray = parsedObject.data;
        const bufferFromData = Buffer.from(dataArray);
        return `data:image/jpeg;base64,${bufferFromData.toString('base64')}`;
    } catch (error) {
        console.error('Error parsing image data:', error);
        return null;
    }
}

export function convertImageToBlob(imageData:string){
    return Buffer.from(imageData.split(",")[1], 'base64');
}