"use client";
import About from "@/components/common/home/about";
import Banner from "@/components/common/home/banner";
import ContactSection from "@/components/common/home/contact-us";
import GetStarted from "@/components/common/home/get-started";
import { HomeFooter } from "@/components/common/home/home-footer";
import HomeHeader from "@/components/common/home/home-header";
import HomeSidebar from "@/components/common/home/home-side-bar";
import HowToUse from "@/components/common/home/how-to-use";
import { useEffect, useState } from "react";

export default function Home() {
    const [homeSidebarOpen, setHomeSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<string>("home");
    const toggleSidebar = () => setHomeSidebarOpen(!homeSidebarOpen);
    const sections = [
        "home",
        "about",
        "how to use",
        "get started",
        "contact us",
    ];

    useEffect(() => {
        const sectionElements = document.querySelectorAll("section");
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId =
                        entry.target.getAttribute("id")?.replaceAll("-", " ") ||
                        "";
                    setActiveLink(sectionId);
                    console.log(sectionId)
                }
            });
        }, observerOptions);

        sectionElements.forEach((section) => observer.observe(section));
        console.log(activeLink)
        return () => {
            sectionElements.forEach((section) => observer.unobserve(section));
        };
    }, [activeLink]);

    return (
        <div className="min-h-screen h-auto w-full flex flex-col bg-background relative">
            <HomeHeader
                sections={sections}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                toggleSidebar={toggleSidebar}
            />
            <HomeSidebar
                sections={sections}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                isOpen={homeSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <Banner />
            <About />
            <HowToUse />
            <GetStarted />
            <ContactSection />
            <HomeFooter />
        </div>
    );
}
