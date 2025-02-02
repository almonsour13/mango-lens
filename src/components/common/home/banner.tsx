"use client"
import SectionWrapper from "@/components/wrapper/section-wrapper";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MetaData } from "@/constant/metaData";

export default function Banner(){
    return(
        <div className="relative">
            <div
                className="absolute inset-0 h-full w-full bg-gradient-radial from-transparent via-background/80 to-background "
            />
            <SectionWrapper id="Home" className="min-h-screen h-auto flex w-full py-16 bg-transparent">
                <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="flex-1 flex flex-col items-start justify-center gap-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-shad drop-shadow-3xl">
                            <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">{MetaData.title}</span> <br/>
                            <span className="">Detect Mango Diseases Instantly</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Protect your mango harvest with our AI-powered disease detection app. 
                            Quick, accurate, and easy to use.
                        </p>
                        <div className="flex gap-2">
                            <Link href="/get-started">
                                <Button>
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/get-started">
                                <Button variant="outline">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 hidden lg:flex justify-center items-center mt-8 lg:mt-0">
                        <Image
                            src="/assets/icon/icon.png"
                            alt="MangoPro App Illustration"
                            width={400}
                            height={400}
                            className="rounded-lg drop-shadow-3xl"
                        />
                    </div>
                </div>
            </SectionWrapper>
        </div>
    )
}