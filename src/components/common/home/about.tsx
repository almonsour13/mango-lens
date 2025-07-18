import SectionWrapper from "@/components/wrapper/section-wrapper";
import { MetaData } from "@/constant/metaData";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ArrowRight,
    Camera,
    Cloud,
    Cpu,
    Leaf,
    LineChart,
    ShieldCheck,
    Smartphone,
    WifiOff,
} from "lucide-react";

export default function About() {
    const features = [
        {
            icon: Camera,
            title: "Easy Scanning",
            description:
                "Just take a photo of the mango leaf to start detection.",
        },
        {
            icon: Cpu,
            title: "Quick Results",
            description: "Get instant disease analysis within seconds.",
        },
        {
            icon: WifiOff,
            title: "Offline Mode",
            description: "Works without internet in remote farm areas.",
        },
        {
            icon: ShieldCheck,
            title: "Precision Diagnosis",
            description:
                "Identifies the most likely disease with high accuracy per scan.",
        },
        {
            icon: Cpu,
            title: "Single-Label Classification",
            description:
                "Accurate detection of one disease category per leaf scan.",
        },
        {
            icon: LineChart,
            title: "Insightful Analytics",
            description:
                "Track progress, view past scans, and monitor farm health trends.",
        },
    ];

    return (
        <SectionWrapper id="about" className="py-24">
            <div className="md:max-w-7xl mx-auto space-y-32 mt-20">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 max-w-6xl mx-auto">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        About Our Platform
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                        Revolutionizing Mango Disease Detection with{" "}
                        <span className="text-primary">{MetaData.title}</span>
                    </h2>
                    <p className="text-md text-muted-foreground leading-relaxed">
                        MangoLens is an advanced agricultural technology
                        solution that empowers farmers and agricultural
                        professionals to identify and manage mango diseases
                        efficiently, improving crop yields and reducing losses.
                    </p>
                </div>

                {/* Main Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Left Column - Image */}
                    <div className="relative">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full opacity-70" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full opacity-70" />

                        <div className="relative bg-card rounded-md overflow-hidden border">
                            <div className="aspect-video relative">
                                <Image
                                    src="/assets/mango-lens-team.jpg"
                                    alt="MangoLens Team"
                                    width={800}
                                    height={600}
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                    <div className="text-white">
                                        <h3 className="text-xl font-bold mb-1">
                                            The MangoLens Team
                                        </h3>
                                        {/* <p className="text-sm text-slate-200">
                                            Dedicated agricultural technology
                                            experts
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-foreground">
                            Our Mission
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            At MangoLens, {"we're"} committed to bridging the
                            gap between technology and agriculture. Our mission
                            is to provide accessible, accurate, and timely
                            disease detection tools that help protect mango
                            crops worldwide, ensuring food security and
                            improving farmer livelihoods.
                        </p>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-foreground">
                                Why MangoLens?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "99.2% Detection Accuracy",
                                    "Works Offline in Fields",
                                    "Instant Results in Seconds",
                                    "Free for Small Farmers",
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        </div>
                                        <span className="text-foreground">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="space-y-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                            Key Features
                        </h3>
                        <p className="text-muted-foreground">
                            MangoLens combines cutting-edge technology with
                            user-friendly design to deliver a comprehensive
                            disease detection solution for mango farmers and
                            agricultural professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card/50 p-6 rounded-md border"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-4">
                                    <feature.icon
                                        size={24}
                                        className="text-primary"
                                    />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
