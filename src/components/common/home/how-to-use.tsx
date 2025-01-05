import SectionWrapper from "@/components/wrapper/section-wrapper"
import { Card, CardContent, } from "@/components/ui/card"
import { Camera, Upload, Search,BarChart } from 'lucide-react'

export default function HowToUse() {
  const steps = [
    {
      title: "Take a Photo",
      description: "Use your device's camera to take a clear picture of the affected mango leaf or fruit.",
      icon: Camera,
    },
    {
      title: "Upload Image",
      description: "Upload the photo to our app. Make sure the image is well-lit and focused on the diseased area.",
      icon: Upload,
    },
    {
      title: "Get Results",
      description: "Our AI will analyze the image and provide a diagnosis of the detected disease, if any.",
      icon: Search,
    },
    {
      title: "Track Progress",
      description: "Monitor the health of your mango plants over time by keeping records of diagnosed issues.",
      icon: BarChart,
    },
  ];
  

  return (
    <SectionWrapper id="How-to-use" className="py-16">
      <div className="w-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold h-full mb-8 text-left">
            <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">How to Use MangoPro</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step, index) => (
            <Card key={index} className="group shadow-none hover:shadow-md   transition-transform duration-300 ease-out">
              {/* <CardHeader>
                <CardTitle className="flex items-center gap-1">
                  <div className="flex font-light p-2 h-8 w-8 items-center justify-center text-base bg-muted rounded-full">
                    {index + 1}
                  </div>
                </CardTitle>
              </CardHeader> */}
              <CardContent className="p-4">
                <div className="flex flex-col items-start gap-4">
                  <div className="bg-muted p-2 rounded-lg">
                    <step.icon className="text-secondary h-8 w-8" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-semibold">{step.title}</h1>
                  <p className="text-left text-sm lg:text-md text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}