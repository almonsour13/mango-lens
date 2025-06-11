import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/wrapper/section-wrapper";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Shield,
    Smartphone,
    Users,
    Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GetStarted() {
    const benefits = [
        {
            icon: Zap,
            title: "Instant Results",
            description: "Get disease diagnosis in under 3 seconds",
        },
        {
            icon: Shield,
            title: "99.2% Accuracy",
            description: "Trusted by agricultural professionals worldwide",
        },
        {
            icon: Smartphone,
            title: "Works Offline",
            description: "Use in remote locations without internet",
        },
        {
            icon: Clock,
            title: "24/7 Available",
            description: "Analyze your crops anytime, anywhere",
        },
    ];

    return (
        <SectionWrapper
            id="get-started"
            className="py-24 bg-gradient-to-b from-muted/50 to-background"
        >
            <div className="max-w-7xl mx-auto mt-20">
                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        Join Farmers Worldwide
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                        Start Protecting Your{" "}
                        <span className="text-primary">Mango Harvest</span>{" "}
                        Today
                    </h2>
                    <p className="text-md text-muted-foreground mb-8">
                        Get accurate, real-time diagnosis of mango diseases with
                        our AI-powered platform. Save your crops from potential
                        damage with timely insights and professional
                        recommendations.
                    </p>

                    {/* Quick CTA for existing users */}
                    <div className="flex gap-4 justify-center items-center mb-12">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                Get Started
                                <ArrowRight
                                    size={18}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </Link>
                        <Link href="/signin">
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 rounded-lg font-semibold"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {benefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className="text-center border bg-card/50 transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon
                                        size={24}
                                        className="text-primary"
                                    />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}
