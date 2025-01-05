'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { WifiOff } from 'lucide-react'
import useOnlineStatus from '@/hooks/use-online'

export function OnlineStatusToast() {
  const isOnline = useOnlineStatus()
  const { toast } = useToast()
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    if (isOnline) {
      setShowOfflineAlert(false)
      toast({
        title: 'Online',
        description: 'Your internet connection has been restored.',
        duration: 3000, 
      })
    } else {
      setShowOfflineAlert(true)
    }
  }, [isOnline, toast])

  if (showOfflineAlert) {
    return (
      <div className="w-full flex justify-center items-center px-4 border-b bg-background">
        <div className="flex items-center gap-2 text-xs">
          <WifiOff className="h-3 w-3" /> 
          <p>You are currently offline. Please check your internet connection.</p>
        </div>
      </div>
    )
  }

  return null
}

