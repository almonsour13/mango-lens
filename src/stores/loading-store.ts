import { observable } from "@legendapp/state";

export const loadingStore$ = observable({
    user:false,
    farm:false,
    tree:false,
    treeimage:false,
    image:false,
    analysis:false,
    analyzedimage:false,
    diseseidentified:false,
    feedback:false,
    feedbackResponse:false,
    trash:false,
})