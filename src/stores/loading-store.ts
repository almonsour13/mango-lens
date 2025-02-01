import { observable } from "@legendapp/state";

export const loadingStore$ = observable({
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