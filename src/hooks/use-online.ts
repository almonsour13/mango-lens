"use client";
import { useState, useEffect } from "react";

const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState<boolean>(typeof window !== "undefined" && navigator.onLine);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
 
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};

export default useOnlineStatus;
