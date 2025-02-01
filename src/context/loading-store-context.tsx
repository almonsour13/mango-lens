import { loadingStore$ } from "@/stores/loading-store";
import { computed } from "@legendapp/state";
import { createContext, useContext } from "react";

// Global loading state: true if any of the values in loadingStore$ are true
const areStoresLoading = computed(() => 
    Object.values(loadingStore$.get()).some(value => value === true)
);

const LoadingStoreContext = createContext({ areStoresLoading });

export const StoresLoadingProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <LoadingStoreContext.Provider value={{ areStoresLoading }}>
            {children}
        </LoadingStoreContext.Provider>
    );
};

export const useStoresLoading = () => useContext(LoadingStoreContext);
