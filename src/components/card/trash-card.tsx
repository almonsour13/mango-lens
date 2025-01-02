'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Check, ImageIcon, TreeDeciduous } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrashActionMenu } from "@/components/action menu/trash-action-menu"
import { cn } from "@/lib/utils"

import { Image as ImageType, Tree, Trash as TRS } from "@/type/types"

type TrashItem = TRS & { item: Tree | ImageType }

interface TrashCardProps {
  trash: TrashItem
  isSelected: boolean
  selected: number[]
  setSelected: (value: number[]) => void
  handleAction: (action: number, trashID: number) => void
}

export const TrashCard = ({
  trash,
  isSelected,
  selected,
  setSelected,
  handleAction,
}: TrashCardProps) => {
  const isTree = trash.type === 1
  const isImage = trash.type === 2
  const [isCheck, setIsCheck] = useState(selected.includes(trash.trashID))

  useEffect(() => {
    if (!isSelected) {
      setIsCheck(false)
    }
  }, [isSelected])

  useEffect(() => {
    setIsCheck(selected.includes(trash.trashID))
  }, [isSelected, selected, trash.trashID])

  const handleCheck = () => {
    if (isSelected) {
      setIsCheck(!isCheck)
      let updatedSelected = [...selected]
      if (updatedSelected.includes(trash.trashID)) {
        updatedSelected = updatedSelected.filter((id) => id !== trash.trashID)
      } else {
        updatedSelected.push(trash.trashID)
      }
      setSelected(updatedSelected)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden group aspect-square cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "scale-95",
        isSelected && isCheck && "border-4 border-primary scale-100"
      )}
      onClick={handleCheck}
    >
      <CardContent className="p-0 flex flex-col w-full h-full">
        <div className="relative overflow-hidden  flex-1">
          
          {isTree ? (
            <div className="w-full h-full flex justify-center items-center p-8 bg-muted">
              <TreeDeciduous className="h-full w-full text-muted-foreground/20" />
            </div>
          ) : isImage ? (
            <Image
              src={(trash.item as ImageType).imageData}
              alt={`Image ${(trash.item as ImageType).imageID}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center p-8 bg-muted">
              <ImageIcon className="h-full w-full text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-3">
            <div className="w-full flex justify-between">
            {isSelected ? (
            <div
              className={cn(
                "absolute h-6 w-6 top-2 left-2 z-10 rounded-full border-2 border-primary flex items-center justify-center transition-colors",
                isCheck ? "bg-primary" : "bg-background"
              )}
            >
              {isCheck && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </div>
            ):(
              <div className={`bg-muted-foreground text-white px-2.5 py-0.5 rounded-full text-xs flex items-center`}>
                  {trash.type == 1? "Tree":"Image"}
              </div>
            )}
            </div>
            <div className="w-full flex items-end justify-between">
              <div className="flex flex-col">
                {isTree && (
                  <h3 className="font-semibold text-md text-white truncate">
                    {(trash.item as Tree).treeCode}
                  </h3>
                )}
                <div className="flex items-center gap-2 text-white/70">
                  {/* {isTree ? (
                    <TreeDeciduous className="text-muted-foreground" size={16} />
                  ) : (
                    <ImageIcon className="text-muted-foreground" size={16} />
                  )} */}
                  <p className="text-xs ">
                    {formatDistanceToNow(new Date(trash.deletedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <TrashActionMenu trashID={trash.trashID} handleAction={handleAction} />
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

