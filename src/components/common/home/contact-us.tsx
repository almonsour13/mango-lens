"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    Mail,
    MapPin,
    Phone,
    Clock,
    MessageCircle,
    Users,
    Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SectionWrapper from "@/components/wrapper/section-wrapper";
import { MetaData } from "@/constant/metaData";

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "Get help via email",
            contact: "support@mangolens.com",
            responseTime: "Within 24 hours",
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Speak with our team",
            contact: "+1 (555) 123-4567",
            responseTime: "Mon-Fri, 9AM-6PM EST",
        }
    ];

    const supportOptions = [
        {
            icon: Users,
            title: "General Inquiries",
            description: "Questions about MangoLens features and pricing",
        },
        {
            icon: Headphones,
            title: "Technical Support",
            description: "Help with app functionality and troubleshooting",
        },
        {
            icon: MapPin,
            title: "Partnership",
            description: "Interested in partnering with MangoLens",
        },
    ];

    async function onSubmit(data: ContactFormValues) {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        console.log(data);
        toast({
            title: "Message sent successfully!",
            description:
                "We've received your message and will get back to you within 24 hours.",
        });
        form.reset();
    }

    return (
        <SectionWrapper
            id="contact-us"
            className="py-24 bg-gradient-to-b from-background to-muted/50"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        {"We're"} Here to Help
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        Get in Touch with{" "}
                        <span className="text-primary">{MetaData.title}</span>
                    </h2>
                    <p className="text-md text-muted-foreground">
                        Have questions about our disease detection platform? Our
                        team of agricultural experts is ready to assist you.
                    </p>
                </div>

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {contactMethods.map((method, index) => (
                        <Card
                            key={index}
                            className="text-center border bg-card/50 "
                        >
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <method.icon
                                        size={24}
                                        className="text-primary"
                                    />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {method.description}
                                </p>
                                <p className="font-medium text-foreground mb-1">
                                    {method.contact}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column - Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">
                                How Can We Help?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Whether {"you're"} a small-scale farmer or managing
                                large agricultural operations, our team is here
                                to support your success with MangoLens.
                            </p>
                        </div>

                        {/* Support Options */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">
                                What We Can Help With:
                            </h4>
                            {supportOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border hover:border-primary/20 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <option.icon
                                            size={20}
                                            className="text-primary"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-foreground mb-1">
                                            {option.title}
                                        </h5>
                                        <p className="text-sm text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Right Column - Contact Form */}
                    <Card className="border bg-card/50">
                        <CardContent className="p-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    Send Us a Message
                                </h3>
                                <p className="text-muted-foreground">
                                    Fill out the form below and {"we'll"} get back
                                    to you within 24 hours.
                                </p>
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium">
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your full name"
                                                            className="border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium">
                                                        Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            className="border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-medium">
                                                    Subject
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="What's this regarding?"
                                                        className="border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-medium">
                                                    Message
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Please provide details about your inquiry..."
                                                        className="min-h-[120px] border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full py-3 font-semibold transition-colors"
                                        disabled={isLoading}
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                                        
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SectionWrapper>
    );
}
