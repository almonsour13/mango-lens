import React from "react";
interface PageWrapper {
    children: React.ReactNode;
    className?:string;
}
const PageWrapper: React.FC<PageWrapper> = ({
    children,
    className
    }) => {
    return(
        //bg-white dark:bg-background
        //rounded-lg rounded-b-none md:rounded-tr-none
        <section 
            // style={{ minHeight: 'calc(100vh - 64px)' }}
            className={`flex-1 gap-4 md:gap-4 flex flex-col px-4 py-4 md:p-4 pb-20 relative ${className}`}
            >
            {children}
        </section>

    )
}
export default PageWrapper;