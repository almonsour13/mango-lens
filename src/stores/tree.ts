import { v4 as uuidv4 } from "uuid";
import type { Tree } from "@/types/types";
import { image$, tree$ } from "./stores";
import { observable } from "@legendapp/state";
import { convertBlobToBase64 } from "@/utils/image-utils";

interface TreeWithImage extends Tree {
    treeImage: string;
    recentImage: string | null;
    imagesLength: number;
}
interface UpdateTree {
    treeID: string;
    treeCode: string;
    description: string;
    status: number;
    treeImage?: string;
}
export function addTree(
    userID: string,
    treeCode: string,
    description: string
): Tree {
    const observableTree = observable(tree$);
    const treeID = uuidv4();
    const newTree = {
        treeID,
        userID,
        treeCode,
        description,
        status: 1,
        addedAt: new Date(),
    };
    observableTree[treeID].assign(newTree);  
    return newTree;
}

export function getTreesByUser(userID: string): TreeWithImage[] {
    const trees = Object.values(observable(tree$).get() || {}).filter(
        (tree) => tree.userID === userID
    );
    const treeWidthImage = trees.map((tree) => {
        const images = Object.values(observable(image$).get() || {}).filter(
            (image) => image.treeID === tree.treeID
        );
        const recentImage = images.sort(
            (a, b) => 
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
        )[0];
        const treeImage = "";
        return {
            ...tree,
            treeImage: "",
            recentImage: recentImage
                ? convertBlobToBase64(recentImage.imageData)
                : null,
            imagesLength: images.length,
        };
    });
    return treeWidthImage;
}

export function getTreeByID(treeID: string): Tree | null {
    const tree = observable(tree$)
    return tree[treeID].get() || null;
}

export function updateTreeByID({
    treeID,
    treeCode,
    description,
    status,
}: UpdateTree) {
    const observableTree = observable(tree$);
    const tree = observableTree[treeID].get();
    if (!tree) return null;

    observableTree[treeID].set({
        ...tree,
        treeCode,
        description,
        status,
    });
    return observableTree[treeID].get();
}

