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

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl opacity-40 animate-pulse delay-1000" />

            <SectionWrapper
                id="Home"
                className="min-h-screen h-auto flex w-full py-20 bg-transparent relative z-10"
            >
                <div className="max-w-7xl mx-auto px-4 flex-1 flex flex-col lg:flex-row items-center gap-24 md:gap-16 mt-8 md:mt-16">
                    {/* Left Content */}
                    <div className="flex-1 flex flex-col items-start justify-center space-y-8">
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
                        <div className="flex gap-4 pt-4">
                            <Link href="#get-started">
                                <Button
                                    size="lg"
                                    className="px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex justify-center items-center relative">
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="relative bg-card rounded-2xl shadow-2xl p-8 border">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-50" />
                                <div className="relative">
                                    <Image
                                        src="/assets/webiste-qr.png"
                                        alt="MangoPro Disease Detection Platform"
                                        width={350}
                                        height={350}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -left-4 bg-card rounded-lg shadow-lg p-4 border animate-bounce">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <span className="text-sm font-medium text-foreground">
                                        Disease Detected
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Anthracnose - 94% confidence
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 bg-card rounded-lg shadow-lg p-4 border animate-pulse">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                                    <span className="text-sm font-medium text-foreground">
                                        Analysis Complete
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Results in 2.3 seconds
                                </div>
                            </div>

                            {/* Background Decoration */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-20" />
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
