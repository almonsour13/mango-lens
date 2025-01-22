interface UserInfo {
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    profileImage?: string;
}

// Store key for localStorage
const USER_STORAGE_KEY = "userInfo";

export function getUser(): UserInfo | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
        try {
            return JSON.parse(userData) as UserInfo;
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            return null;
        }
    }
    return null;
}
export function setUser(user: UserInfo): void {
    if (typeof window === "undefined") return;
    try {
        const userData = JSON.stringify(user);
        localStorage.setItem(USER_STORAGE_KEY, userData);
    } catch (error) {
        console.error("Failed to save user data to localStorage", error);
    }
}
export function removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
}
