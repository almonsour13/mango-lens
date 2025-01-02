import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Loading(){
    return(
        <PageWrapper>
             <div className="w-full h-full flex-1 flex items-center justify-center animate-pulse min-h-screen">
                loading
             </div>
        </PageWrapper>
    )
}