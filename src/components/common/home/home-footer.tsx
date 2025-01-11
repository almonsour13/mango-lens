'use client'

import { MetaData } from "@/constant/metaData"

export function HomeFooter() {
  
  return (
    <div id='' className='h-16 px-4 md:px-12 lg:px-16 flex items-center'>
        <div className="w-full flex items-center justify-center">
            <div className="flex border-muted-foreground/20 text-center text-muted-foreground">
              <p className='text-sm'>&copy; {new Date().getFullYear()} {MetaData.title}. All rights reserved.</p>
            </div>
        </div>
    </div>
  )
}