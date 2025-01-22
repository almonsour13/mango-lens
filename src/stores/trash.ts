import type { Trash } from "@/types/types";
import { observable } from "@legendapp/state";
import { createStore } from "./store-config";

export const trash$ = createStore<Trash>("trash");

export function getTrashByUserID(userID:number){
    const images = Object.values(observable(trash$).get() || {}).filter(
        (trash) => trash.userID === userID
    );
    return  images;
}
