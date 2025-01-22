import type { Tree } from "@/types/types"
import { createStore } from "./store-config";
import { v4 as uuidv4 } from "uuid"
import { observable } from "@legendapp/state";
import { image$ } from "./store";
import { convertBlobToBase64 } from "@/utils/image-utils";


interface TreeWithImage extends Tree {
    treeImage:string;
    recentImage: string | null;
    imagesLength: number;
}

interface UpdateTree{
    treeID:string,
    treeCode:string,
    description:string,
    status:number,
    treeImage?:string
}
export const tree$ = createStore<Tree>("tree")

export function addTree(userID: number, treeCode: string, description: string): Tree {
  const treeID = uuidv4()
  const newTree: Tree = {
    treeID,
    userID,
    treeCode,
    description,
    status: 1,
    addedAt: new Date(),
  }
  tree$[treeID].set(newTree)
  return newTree
}

export function getTreesByUser(userID: number): TreeWithImage[] {
    const trees = Object.values(observable(tree$).get() || {}).filter((tree) => tree.userID === userID);
    const treeWidthImage = trees.map((tree) => {
        const images = Object.values(observable(image$).get() || {}).filter((image) => image.treeID === tree.treeID);
        const recentImage = images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
        const treeImage = ""
        return {
            ...tree,
            treeImage: "",
            recentImage: recentImage?convertBlobToBase64(recentImage.imageData):null,
            imagesLength: images.length
        }
    })
    return treeWidthImage;
}

export function getTreeByID(treeID: string): Tree | null {
  return tree$[treeID].get() || null
}

export function updateTreeByID({ treeID, treeCode, description, status, treeImage }: UpdateTree) {
 const tree = tree$[treeID].get();
     if (!tree) return null;
 
     tree$[treeID].set({
         ...tree,
         treeCode,
         description,
         status,
     });
     return tree$[treeID].get();
}

