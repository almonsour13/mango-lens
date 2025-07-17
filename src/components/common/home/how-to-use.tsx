import SectionWrapper from "@/components/wrapper/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
    Upload,
    UserPlus,
    TreeDeciduous,
    FileText,
    ArrowRight,
    Home,
    Lightbulb,
    CheckCircle2,
    Info,
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
            gif: "/assets/how-to-use/create-account.png",
        },
        {
            title: "Add a Farm",
            description:
                "Register your farm details including location, size, and environmental conditions.",
            icon: Home,
            gif: "/assets/how-to-use/add-farm.png",
        },
        {
            title: "Add a Tree",
            description:
                "Enter details such as tree code and description to start tracking its health.",
            icon: TreeDeciduous,
            gif: "/assets/how-to-use/add-tree.png",
        },
        {
            title: "Upload an Image",
            description:
                "Upload the photo of the leaf under the specific tree record. For best results, we recommend using a plain white background.",
            icon: Upload,
            gif: "/assets/how-to-use/upload-image.png",
        },
        {
            title: "Get and Export Results",
            description:
                "View the diagnosis result and export it for documentation or further review.",
            icon: FileText,
            gif: "/assets/how-to-use/get-result.png",
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
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
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
                    <div className="flex flex-wrap gap-4 justify-center">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="w-full md:w-[410px] relative rounded border bg-card shadow-none transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="w-full h-auto">
                                    <Image
                                        src={
                                            step.gif ||
                                            "/placeholder.svg?height=300&width=500"
                                        }
                                        alt={`How to ${step.title.toLowerCase()}`}
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-contain"
                                        unoptimized // Preserve GIF animation
                                    />
                                </div>

                                {/* Optional Content Section */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded flex items-center justify-center border bg-primary/10 font-semibold text-primary">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-16 bg-primary/5 border border-primary/20 rounded-md p-6 md:p-8">
                    <div className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            <h4 className="font-medium text-lg">
                                Pro Tips for Best Results
                            </h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                            Follow these tips to get the most accurate leaf
                            analysis
                        </p>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-xs">
                                    Natural Light
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Capture images in natural daylight for
                                    accurate detection
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-2">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-xs">
                                    Clean Background
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Use a white or neutral background for better
                                    results
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-2">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-xs">
                                    Full Visibility
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Ensure the entire leaf is visible in the
                                    frame
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-2">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-xs">
                                    Focus & Clarity
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Take sharp, in-focus images showing leaf
                                    details clearly
                                </p>
                            </div>
                        </li>
                    </ul>

                    <div className="mt-3 pt-3 border-t border-primary/10">
                        <div className="flex items-center gap-1.5 text-xs text-primary">
                            <Info className="h-3.5 w-3.5" />
                            <span>
                                Better images lead to more accurate analysis
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
