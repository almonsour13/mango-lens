import { supabase } from "@/supabase/supabase";
import { observable } from "@legendapp/state";
import { syncPlugin } from "./config";

export const disease$ = observable(
    syncPlugin({
        list: async () => {
            try {
                const { data, error } = await supabase
                    .from("disease")
                    .select("*")

                if (error) throw error;
                return data;
            } catch (error) {
                console.error(`Error fetching disease:`, error);
                throw error;
            } 
        },
        persist: {
            name: "disease",
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        updatePartial: true,
    })
);
