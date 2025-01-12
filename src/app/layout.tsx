import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
// import { CameraProvider } from "@/context/user-camera-context";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MetaData } from "@/constant/metaData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: MetaData.title,
  description: "A web-based application for managing mango tree health and diagnosing diseases using leaf image analysis.",
  category: "website",
  generator: "Next.js", // framework used
  icons: {
    icon: MetaData.icons.icon,
  },
  manifest:'/manifest.json'
};
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  userScalable: false, 
  width: "device-width", 
  initialScale: 1, 
  maximumScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* <CameraProvider>
              <CaptureImageProvider> */}
                <ScrollArea>{children}</ScrollArea>
              {/* </CaptureImageProvider>
            </CameraProvider> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
