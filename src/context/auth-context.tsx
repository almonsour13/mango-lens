"use client";

import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { deleteUserCredentials, getUserCredentials } from "@/utils/indexedDB/store/user-info-store";

interface UserInfo {
    userID: number;
    role: number;
}

interface UserDredentials {
    userID: number;
    fName: string;
    lName: string;
    email: string;
    role:number;
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
    const [userInfo, setUserInfo] = useState<UserDredentials | null>(null);
    const [decodedToken, setDecodedToken] = useState<UserInfo | null>(null);

    useEffect(() => {
        const cookieToken = getTokenFromCookie();
        setToken(cookieToken);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode<UserInfo>(token);
                    setDecodedToken(decoded)
                    const userCredentials = await getUserCredentials(decoded.userID);
                    
                    if (userCredentials?.userID && userCredentials.fName && userCredentials.lName && userCredentials.email) {
                        setUserInfo({
                            userID: userCredentials.userID,
                            fName: userCredentials.fName,
                            lName: userCredentials.lName,
                            email: userCredentials.email,
                            role: decoded.role,
                            profileImage: userCredentials.profileImage || ''
                        });
                    }
                    
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        };
        fetchUserInfo();
    }, [token]);

    const resetToken = async () => {
        if (token && decodedToken?.userID) {
            await deleteUserCredentials(decodedToken.userID)
            setToken(null);
            setDecodedToken(null)
        }
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
