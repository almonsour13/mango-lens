import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/wrapper/section-wrapper";
import Link from "next/link";

export default function GetStarted() {
    return (
        <SectionWrapper id="Get-started" className="py-16">
            <div className="flex flex-col items-center justify-center w-full text-center min-h-96 h-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
                        Get Started
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Get accurate, real-time diagnosis of mango diseases with our
                    easy-to-use app. Save your crops from potential damage with
                    timely insights.
                </p>
                <div className="flex gap-4">
                    <Link href="/signup">
                        <Button>Sign in</Button>
                    </Link>

                    <Link
                        href="/signin"
                    >
                        <Button variant="secondary">Sign in</Button>
                    </Link>
                </div>
            </div>
        </SectionWrapper>
    );
}
