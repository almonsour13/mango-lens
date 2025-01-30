"use client";

import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { getUser, removeUser } from "@/stores/user-store";
import { clearDatabase, initializeStore } from "@/stores/stores";
import { checkAndInitializeDatabase } from "@/stores/indexeddb";

interface UserInfo {
    userID: string;
    role: number;
}

interface UserDredentials {
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    profileImage?: string;
}

interface AuthContextType {
    userInfo: UserDredentials | null;
    isLoaded: boolean;
    resetToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to get token from cookies
function getTokenFromCookie(): string | null {
    if (typeof window === "undefined") return null;
    return (
        document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1] || null
    );
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [decodedToken, setDecodedToken] = useState<UserInfo | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const userInfo = getUser();
    // useEffect(() => {
    //     const role = userInfo?.role
    //     if(pathname === "/"){
    //         return
    //     }
    //     if(isLoaded){
    //     if (!token) {
    //         router.push("/signin");
    //       } else if (userInfo) {
    //         const { role } = userInfo;
    //         if (role === 1 && !pathname.startsWith("/admin")) {
    //           router.push("/admin");
    //         } else if (role === 2 && !pathname.startsWith("/user")) {
    //           router.push("/user");
    //         } else if ((role !== 1 && pathname.startsWith("/admin")) || (role !== 2 && pathname.startsWith("/user"))) {
    //           router.push("/unauthorized");
    //         }
    //       }
    //     }
    // }, [pathname, userInfo, token, isLoaded]);
    
    useEffect(() => {
        const cookieToken = getTokenFromCookie();
        setToken(cookieToken);
        setIsLoaded(true);
    }, []);
    useEffect(()=>{
        const check = async () => {
            await checkAndInitializeDatabase()
        }
        // if(userInfo){
            check()
        // }
    },[])

    // useEffect(() => {
    //     const fetchUserInfo = async () => {
    //         if (token) {
    //             try {
    //                 const decoded = jwtDecode<UserInfo>(token);
    //                 setDecodedToken(decoded);
    //                 const userCredentials = getUser()
    //                 if (
    //                     userCredentials?.userID &&
    //                     userCredentials.fName &&
    //                     userCredentials.lName &&
    //                     userCredentials.email
    //                 ) {
    //                     setUserInfo({
    //                         userID: userCredentials.userID,
    //                         fName: userCredentials.fName,
    //                         lName: userCredentials.lName,
    //                         email: userCredentials.email,
    //                         role: decoded.role,
    //                         profileImage: userCredentials.profileImage || "",
    //                     });
    //                 }
    //             } catch (error) {
    //                 console.error("Error decoding token:", error);
    //             }
    //         }
    //     };
    //     fetchUserInfo();
    // }, [token]);

    const resetToken = async () => {
        // if (token && decodedToken?.userID) {
            removeUser();
            setToken(null);
            setDecodedToken(null);
            
            // deleteAllStores();
            // clearDatabase()
        // }
    };

    return (
        <AuthContext.Provider value={{ userInfo, isLoaded, resetToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
