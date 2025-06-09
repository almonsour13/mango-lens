import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";
import { supabase } from "@/supabase/supabase";
import { getUser } from "./user-store";
import { v4 as uuidv4 } from "uuid";
import { loadingStore$ } from "./loading-store";
import { data } from "@tensorflow/tfjs";
import { tree$ } from "./tree";
import { tree } from "next/dist/build/templates/app-page";

const userID = getUser()?.userID;

export const farm$ = observable(
    syncPlugin({
        list: async () => {
            try {
                loadingStore$.farm.set(true);
                const { data, error } = await supabase
                    .from("farm")
                    .select("*")
                    .eq("userID", userID);

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching farms:`, error);
                throw error;
            } finally {
                loadingStore$.farm.set(false);
            }
        },
        create: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required");
                }

                const { data, error } = await supabase
                    .from("farm")
                    .insert([value])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error creating farm:`, error);
                throw error;
            }
        },
        update: async (value) => {
            try {
                if (!value.id) {
                    throw new Error("id is required for update");
                }

                const { data, error } = await supabase
                    .from("farm")
                    .update(value)
                    .eq("id", value.id)
                    .eq("userID", userID)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error updating farm:`, error);
                throw error;
            }
        },
        persist: {
            name: "farm",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);

export const addFarm = async (
    farmName: string,
    address: string,
    description?: string
): Promise<{ success: boolean; message: string; data:any }> => {
    try {
        const farmID = uuidv4();
        const newFarm:any = {
            farmID,
            userID: userID,
            farmName,
            address,
            description,
            status: 1,
            addedAt: new Date(),
        };
        farm$[farmID].set(newFarm);
        return { success: true, data:newFarm, message: "Farm updated successfully." };   
    } catch (error) {
        console.error("Error adding farm:", error);
        return { success: false, message: "Failed to add farm. Please try again.", data:[] };
    }
};
export const updateFarm = async (
    farmID: string,
    farmName: string,
    address: string,
    status: number,
    description?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const farm = farm$[farmID].get();
        if (!farm) {
            return { success: false, message: "Farm not found." };
        }
        const updatedFarm = {
            ...farm,
            farmName,
            address,
            description,
            updatedAt: new Date(),
            status: status, 
        };
        console.log("Updating farm:", updatedFarm);
        farm$[farmID].set(updatedFarm);

        return { success: true, message: "Farm updated successfully." };    

    } catch (error) {
        console.error("Error updating farm:", error);
        return { success: false, message: "Failed to update farm. Please try again." };
    }

}
export const getFarmByUser = async (): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
}> => {
    if (!userID) return { success: false, message: "User not found." };
    try {
        const farms = Object.values(farm$.get() || {});
        const updatedFarms = farms.map(farm => {
            const totalTrees = Object.values(tree$.get() || {}).filter(tree => tree.farmID === farm.farmID).length;
            const healthyTrees = 0;
            const healthRate = totalTrees > 0 ? (healthyTrees / totalTrees) * 100 : 0;
            return {
                ...farm,
                totalTrees,
                healthyTrees,
                healthRate: healthRate.toFixed(2) + '%'
            };
        }
        );
        return { success: true, data: updatedFarms, message: "Farms fetched successfully." };
    } catch (error) {
        console.error(`Error fetching farms for user ${userID}:`, error);
        return { success: false, message: "Failed to fetch farms." };
    }
};
export const getFarmByID = async (farmID: string): Promise<any> => {
    if (!farmID) throw new Error("Farm ID is required.");
    try {
        const farm = farm$[farmID].get();
        if (!farm) throw new Error(`Farm with ID ${farmID} not found.`);
        const totalTrees = Object.values(farm$.get() || {}).filter(tree => tree.farmID === farmID).length;
        const healthyTrees = 0;
        const healthRate = 0;

        return {
            data: {
                ...farm,
                totalTrees,
                healthRate
            },
            success: true,
            message: "Farm fetched successfully.",
        };
    } catch (error) {
        console.error(`Error fetching farm by ID ${farmID}:`, error);
        throw error;
    }
}
