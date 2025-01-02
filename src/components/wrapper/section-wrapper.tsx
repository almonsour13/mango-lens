import React from "react";
interface SectionWrapper {
    id:string;
    children: React.ReactNode;
    className?:string;
}
const SectionWrapper: React.FC<SectionWrapper> = ({
    id,
    children,
    className
    }) => {
    return(
        <section id={id}
            className={`relative min-h-screen px-4 md:px-12 lg:px-16 flex items-center ${className}`}
            >
            {children}
        </section>

    )
}
export default SectionWrapper;