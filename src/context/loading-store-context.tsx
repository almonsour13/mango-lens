import { loadingStore$ } from "@/stores/loading-store";
import { computed } from "@legendapp/state";
import { createContext, useContext, useEffect, useState } from "react";
import { useObservable } from "@legendapp/state/react";

// Create a computed observable for global loading state
const areStoresLoading$ = computed(() =>
    Object.values(loadingStore$.get()).some((value) => value === true)
);

// Create Context
const LoadingStoreContext = createContext<any>(null);

// Provider Component
export const StoresLoadingProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [areStoresLoading, setAreStoresLoading] = useState(false);
    // Use observables to trigger re-renders when the state changes
    const areStoresLasdoading = useObservable(areStoresLoading$);

    useEffect(() => {
        setAreStoresLoading(areStoresLasdoading.get());
    }, [areStoresLasdoading]);
    useEffect(() => {
        console.log(areStoresLoading$.get());
    }, [areStoresLoading]);
    return (
        <LoadingStoreContext.Provider value={{ areStoresLoading }}>
            {children}
        </LoadingStoreContext.Provider>
    );
};

// Custom Hook for accessing loading states
export const useStoresLoading = () => {
    const context = useContext(LoadingStoreContext);
    if (!context) {
        throw new Error(
            "useStoresLoading must be used within a StoresLoadingProvider"
        );
    }
    return context;
};
