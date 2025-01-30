"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface ModalDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ModalDrawer = React.forwardRef<HTMLDivElement, ModalDrawerProps>(
  ({ className, open, onOpenChange, ...props }, ref) => {
    const [isDesktop, setIsDesktop] = React.useState(false)

    React.useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768)
      }

      window.addEventListener("resize", handleResize)
      handleResize()
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])

    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent ref={ref} className={cn("max-w-lg", className)} {...props} />
        </Dialog>
      )
    }

    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          ref={ref}
          className={cn("p-4 mt-12 space-y-4 max-h-[80vh]", className)}
          {...props}
        />
      </Drawer>
    )
  }
)

ModalDrawer.displayName = "ModalDrawer"

export default ModalDrawer

