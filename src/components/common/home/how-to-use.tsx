import SectionWrapper from "@/components/wrapper/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
    Upload,
    UserPlus,
    TreeDeciduous,
    FileText,
    ArrowRight,
    Home,
} from "lucide-react";
import { MetaData } from "@/constant/metaData";
import Image from "next/image";

export default function HowToUse() {
    const steps = [
        {
            title: "Create an Account",
            description:
                "Register an account to securely store and manage data related to your mango trees.",
            icon: UserPlus,
            gif: "/assets/how-to-use/create-account.gif",
        },
        {
            title: "Add a Farm",
            description:
                "Register your farm details including location, size, and environmental conditions.",
            icon: Home,
            gif: "/assets/how-to-use/add-farm.gif",
        },
        {
            title: "Add a Tree",
            description:
                "Enter details such as tree code and description to start tracking its health.",
            icon: TreeDeciduous,
            gif: "/assets/how-to-use/add-tree.gif",
        },
        {
            title: "Upload an Image",
            description:
                "Upload the photo of the leaf under the specific tree record. For best results, we recommend using a plain white background.",
            icon: Upload,
            gif: "/assets/how-to-use/upload-image.gif",
        },
        {
            title: "Export Results",
            description:
                "View the diagnosis result and export it for documentation or further review.",
            icon: FileText,
            gif: "/assets/how-to-use/export-results.gif",
        },
    ];

    return (
        <SectionWrapper
            id="how-to-use"
            className="py-24 bg-gradient-to-b from-background to-muted/50"
        >
            <div className="max-w-7xl mx-auto mt-20">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        Simple 5-Step Process
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mb-6 text-foreground">
                        How to Use{" "}
                        <span className="text-primary">{MetaData.title}</span>
                    </h2>
                    <p className="text-md text-muted-foreground">
                        Our intuitive platform makes disease detection simple
                        and efficient. Follow these four steps to protect your
                        mango harvest.
                    </p>
                </div>

                {/* Steps Section */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    {/* <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0"></div> */}

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col h-full">
                                {/* Step Number */}
                                <div className="hidden lg:flex items-center justify-center mb-8">
                                    <div className="relative">
                                        {/* <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div> */}
                                        <div className="relative w-16 h-16 bg-card/50 rounded-full border border-primary flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card */}
                                <Card className="flex-1 overflow-hidden bg-card/50 border  transition-all duration-300 group">
                                    <CardContent className="p-0">
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-video bg-muted overflow-hidden border-b">
                                            <Image
                                                src={
                                                    step.gif ||
                                                    "/placeholder.svg?height=300&width=500"
                                                }
                                                alt={`How to ${step.title.toLowerCase()}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized // For GIFs to maintain animation
                                            />

                                            {/* Mobile Step Number */}
                                            <div className="lg:hidden absolute top-4 left-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full border-2 border-primary flex items-center justify-center shadow-md">
                                                <span className="text-lg font-bold text-primary">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Icon Badge */}
                                            <div className="absolute bottom-4 right-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center">
                                                <step.icon className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-foreground mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Arrow (except for last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex justify-center mt-8">
                                        <ArrowRight className="text-primary h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-16 bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0 bg-primary/10 rounded-full p-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-foreground mb-2">
                                Pro Tips for Best Results
                            </h4>
                            <ul className="space-y-2 text-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    </div>
                                    <span>
                                        Capture images in natural daylight for
                                        the most accurate disease detection
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    </div>
                                    <span>
                                        Place leaves against a white or neutral
                                        background to improve detection accuracy
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    </div>
                                    <span>
                                        Ensure the entire leaf is visible in the
                                        frame for comprehensive analysis
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
