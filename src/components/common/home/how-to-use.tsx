import SectionWrapper from "@/components/wrapper/section-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, UserPlus, TreeDeciduous, FileText } from "lucide-react"
import { MetaData } from "@/constant/metaData"
import Image from "next/image"

export default function HowToUse() {
  const steps = [
    {
      title: "Create an Account",
      description: "Register an account to securely store and manage data related to your mango trees.",
      icon: UserPlus,
      gif: "/assets/how-to-use/create-account.gif",
    },
    {
      title: "Add a Tree",
      description: "Enter details such as tree code and description to start tracking its health.",
      icon: TreeDeciduous,
      gif: "/assets/how-to-use/add-tree.gif",
    },
    {
      title: "Upload an Image",
      description:
        "Upload the photo of the leaf under the specific tree record. For best results, we recommend using a plain white background.",
      icon: Upload,
      gif: "/assets/how-to-use/upload-image.gif",
    },
    {
      title: "Export Results",
      description: "View the diagnosis result and export it for documentation or further review.",
      icon: FileText,
      gif: "/assets/how-to-use/export-results.gif",
    },
  ]

  return (
    <SectionWrapper id="how-to-use" className="py-16">
      <div className="w-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold h-full mb-8 text-left">
          <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
            How to Use {MetaData.title}
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group shadow-none hover:shadow-md transition-transform duration-300 ease-out overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {/* GIF Section */}
                  <div className="relative w-full h-80 md:h-48 bg-muted/20 overflow-hidden">
                    <Image
                      src={step.gif || "/placeholder.svg"}
                      alt={`How to ${step.title.toLowerCase()}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized // For GIFs to maintain animation
                    />
                    {/* Step number overlay */}
                    <div className="absolute top-3 left-3 bg-primary backdrop-blur-sm rounded-full h-7 w-7 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg">
                        <step.icon className="text-secondary h-4 w-4" />
                      </div>
                      <h2 className="text-xl lg:text-lg font-semibold">{step.title}</h2>
                    </div>
                    <p className="text-left text-sm lg:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
