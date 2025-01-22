import { User } from "@/types/types";
import { convertBlobToBase64 } from "../../image-utils";
import { dbOperation } from "../indexedDB";
import { DB_CONFIG } from "../indexedDBconfig";

const USER_INFO_STORE = DB_CONFIG.stores.user;

export async function getUserCredentials(userID: string): Promise<User | null> {
    const userCredentials = await dbOperation<User | null>(USER_INFO_STORE, 'readonly', (store) => store.get(userID));
    if (!userCredentials) return null;
    return {
        ...userCredentials,
        profileImage: convertBlobToBase64(userCredentials?.profileImage)
    }
}

export async function storeUserCredentials(profile: User): Promise<void> {
    const userID = profile.userID;
    return dbOperation<void>(USER_INFO_STORE, 'readwrite', (store) => 
        store.add({...profile, userID})
    );
}
export async function updateUserCredentials(userID: number, profile: Partial<User>): Promise<void> {  
    return dbOperation<void>(USER_INFO_STORE, 'readwrite', (store) => 
        store.put({...profile, userID})
    );
}
export async function deleteUserCredentials(userID: string): Promise<void> {
    return dbOperation<void>(USER_INFO_STORE, 'readwrite', (store) => 
        store.delete(userID)
    );
}

