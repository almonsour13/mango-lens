"use client";

import { MetaData } from "@/constant/metaData";
import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Github,
} from "lucide-react";

export function HomeFooter() {
    const footerLinks = {
        product: [
            { name: "Features", href: "/features" },
            { name: "How it Works", href: "/how-to-use" },
            { name: "Pricing", href: "/pricing" },
            { name: "API Documentation", href: "/docs" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "/careers" },
            { name: "Press Kit", href: "/press" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Community", href: "/community" },
            { name: "Status", href: "/status" },
            { name: "Bug Reports", href: "/bugs" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
            { name: "GDPR", href: "/gdpr" },
        ],
    };

    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: "https://facebook.com/mangolens",
        },
        {
            name: "Twitter",
            icon: Twitter,
            href: "https://twitter.com/mangolens",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: "https://linkedin.com/company/mangolens",
        },
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://instagram.com/mangolens",
        },
        { name: "GitHub", icon: Github, href: "https://github.com/mangolens" },
    ];

     const socials = [
  {
    name: "Facebook",
    icon: Facebook,
    link: "https://www.facebook.com/almonsour.salida",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    link: "https://www.linkedin.com/in/almonsour-salida-5354011ba/",
  },
  {
    name: "Instagram",
    icon: Instagram,
    link: "https://www.instagram.com/al_mnsr13/",
  },
  {
    name: "GitHub",
    icon: Github,
    link: "https://github.com/almonsour13",
  },
];

    return (
        <footer className="border-t border-border">
            <div className="max-w-7xl mx-auto px-4 md:px-0 py-12 ">

                {/* Bottom Section */}
                <div className="border-border">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Copyright */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()}{" "}
                                {MetaData.title}. All rights reserved.
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>Made with</span>
                                <span className="text-red-500">♥</span>
                                <span>for farmers worldwide</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                               Developed by Al-Monsour Salida
                            </span>
                            <div className="flex items-center gap-3">
                                {socials.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 bg-muted hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors group"
                                        aria-label={`Follow us on ${social.name}`}
                                    >
                                        <social.icon
                                            size={16}
                                            className="text-muted-foreground group-hover:text-primary transition-colors"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
