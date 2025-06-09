import { tree$ } from "@/stores/tree";

export const checkTreeCode = async (treeCode: string, farmID:string): Promise<boolean> => {
    const tree = Object.values(tree$.get() || {});
    if (tree.length === 0) return false; // Ensure the array has elements
    return tree.some(t => t.treeCode === treeCode && t.farmID !== farmID);
};
