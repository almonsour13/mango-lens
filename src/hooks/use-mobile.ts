
import { useState, useEffect } from 'react'

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)
  
    useEffect(() => {
      const userAgent = typeof window === "undefined" ? "" : navigator.userAgent
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
    }, [])
  
    return isMobile
  }
export default useIsMobile;  