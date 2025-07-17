"use client";

import SectionWrapper from "@/components/wrapper/section-wrapper";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MetaData } from "@/constant/metaData";
import { ArrowRight, CheckCircle, Shield, Zap, Users } from "lucide-react";

export default function Banner() {
    const features = [
        { icon: Zap, text: "Instant AI-powered detection" },
        { icon: Shield, text: "99.2% accuracy rate" },
        { icon: Users, text: "Trusted by farmers" },
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-muted [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />

            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/50 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/50 rounded-full blur-xl opacity-40 animate-pulse delay-1000" />

            <SectionWrapper
                id="Home"
                className="min-h-screen h-auto flex w-full py-20 md:py-0 bg-transparent relative z-10"
            >
                <div className="max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center gap-24 md:gap-16 mt-8 md:mt-16">
                    {/* Left Content */}
                    <div className="flex-1 flex flex-col items-start justify-center space-y-4 md:space-y-8">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
                            <CheckCircle size={16} className="text-primary" />
                            Trusted by Agricultural Professionals
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                                <span className="text-primary">
                                    {MetaData.title}:{" "}
                                </span>
                                <br />
                                <span className="text-foreground">
                                    Detect Mango Diseases Instantly
                                </span>
                                <br />
                            </h1>

                            <p className="text-md text-muted-foreground max-w-xl">
                                Leverage cutting-edge AI technology to identify
                                and prevent mango diseases before they impact
                                your harvest. Protect your investment with
                                precision agriculture.
                            </p>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <feature.icon
                                            size={16}
                                            className="text-primary"
                                        />
                                    </div>
                                    <span className="text-foreground font-medium">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 ">
                            <Link href="#get-started">
                                <Button
                                    size="lg"
                                    className="px-8 py-3 rounded font-semibold transition-all duration-300 group"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-auto flex justify-center items-center relative">
                        <div className="w-full flex items-center justify-center aspect-square relative bg-card rounded-md p-8 border">
                           
                                <Image
                                    src="/assets/webiste-qr.png"
                                    alt="MangoPro Disease Detection Platform"

                                    width={350}
                                    height={350}
                                    className="rounded-md"
                                />
                            </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
