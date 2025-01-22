import type { Image, ImageAnalysisDetails, ScanResult, Trash } from "@/types/types";
import { createStore } from "./store-config";
import { v4 as uuidv4 } from "uuid";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";
import { observable } from "@legendapp/state";
import { analysis$, analyzedImage$, diseaseIdentified$, tree$ } from "./store";

export const trash$ = createStore<Trash>("trash");

export function getTrashByUserID(userID:number){
    const images = Object.values(observable(trash$).get() || {}).filter(
        (trash) => trash.userID === userID
    );
    
}
