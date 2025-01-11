"use client"

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PendingActionMenu } from "../action menu/pending-action-menu";
import { PendingItem } from "@/types/types";


export default function PendingCard({
    processPendingID,
    pending,
    isSelected,
    selected,
    setSelected,
    handleAction
}:{
    processPendingID:number;
    pending:PendingItem,
    isSelected: boolean;
    selected: number[];
    setSelected: (value: number[]) => void;
    handleAction:(action:number, pendingID:number) => void;
}){
    const [isCheck, setIsCheck] = useState(selected.includes(pending.pendingID));
    
    useEffect(() => {
        if (!isSelected) {
                setIsCheck(false);
        }
    }, [isSelected]);

    useEffect(()=>{
        setIsCheck(selected.includes(pending.pendingID));
    },[isSelected, selected, pending.pendingID])

    const handleCheck = () => {
        if (isSelected) {
            setIsCheck(!isCheck);
        
            let updatedSelected = [...selected]; 
        
            if (updatedSelected.includes(pending.pendingID)) {
                updatedSelected = updatedSelected.filter((id) => id !== pending.pendingID);
            } else {
                updatedSelected.push(pending.pendingID);
            }
            setSelected(updatedSelected); 
        }
    };

    return(
        <Card 
            className={`overflow-hidden group border bg-card cursor-pointer transition-all duration-100  ${isSelected? "scale-95" :""} ${isSelected && isCheck && "ring-4 ring-primary border-0 scale-100" }`}
            onClick={handleCheck}
        >
            <div className="relative aspect-square">
                
                {processPendingID == (pending.pendingID) && (
                    <div className="absolute z-40 inset-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-scan" />
                )}
                {pending.imageUrl && (
                    <Image
                        src={pending.imageUrl}
                        alt={`Tree ${pending.pendingID}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-between">
                    <div className="flex items-start justify-start p-2">
                        {isSelected ? (
                            <div
                                className={`absolute h-6 w-6 top-2 left-2 z-10 rounded-full border-2 border-primary flex items-center justify-center ${
                                isCheck ? "bg-primary" : "bg-background"
                                }`}
                            >
                                {isCheck && <Check className="h-4 w-4 text-white" strokeWidth={3}/>}
                            </div>
                        ):(
                                // <Badge variant={`${pending.status === 1?"destructive":"default"}`} className="text-xs font-medium rounded">
                                //     {pending.status == 1? "Pending":"Processed"}
                                // </Badge>
                            <div className={`${pending.status == 1?"bg-destructive":"bg-primary"} text-white px-2.5 py-0.5 rounded-full text-xs flex items-center`}>
                                {pending.status == 1? "Pending":"Processed"}
                            </div>
                        )}
                    </div>
                    <div className="flex items-end justify-between w-full p-2">
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-md text-white">
                                    {pending.treeCode}
                                </h3>
                                <p className="text-xs text-white/70">
                                    {formatDistanceToNow(new Date(pending.addedAt), { addSuffix: true })}   
                                </p>
                            </div>
                            <PendingActionMenu
                                pendingID={pending.pendingID}
                                status={pending.status}
                                handleAction={handleAction}
                            />
                    </div>
                </div>
            </div>
        </Card>
    )
}