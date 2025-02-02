import { observable } from "@legendapp/state";
import { supabase } from "@/supabase/supabase";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { User } from "@supabase/supabase-js";

interface UserInfo {
    id: string;
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    profileImage?: string;
}

export const userInfo$ = observable<UserInfo | null>(null);
syncObservable(
    userInfo$,
    syncedCrud({
        persist: {
            name: "user-info",
            plugin: ObservablePersistLocalStorage,
            retrySync: true,
        },
        create: async (value) => {
            try {
                console.log("Creating user:", value);
            } catch (error) {
                console.error("Error creating user:", error);
                throw error;
            }
        },
        update: async (value: UserInfo) => {
            try {
                console.log("Updating user:", value);
            } catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);

// Function to update first and last name
export function updateUserInfo(fName: string, lName: string) {
    const user = getUser();
    if (!user) return;

    userInfo$.set({
        ...user,
        fName,
        lName,
    });
}

// Function to set user data
export function setUser(user: UserInfo): void {
    userInfo$.set({
        ...user,
        id: user.userID,
    });
}

// Function to remove user data
export function removeUser(): void {
    userInfo$.delete();
}

// Function to get user data
export function getUser(): UserInfo | null {
    return userInfo$.get() ?? null;
}
