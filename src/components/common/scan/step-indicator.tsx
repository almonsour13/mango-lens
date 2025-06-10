import { Check, Trees, TreeDeciduous, Upload } from "lucide-react"

type Step = "farms" | "trees" | "upload"

interface StepIndicatorProps {
  currentStep: Step
  selectedFarm: any
  selectedTree: any
}

const steps = [
  { id: "farms", label: "Select Farm", icon: Trees },
  { id: "trees", label: "Choose Tree", icon: TreeDeciduous },
  { id: "upload", label: "Upload & Analyze", icon: Upload },
]

export default function StepIndicator({ currentStep, selectedFarm, selectedTree }: StepIndicatorProps) {
  const getStepStatus = (stepId: string) => {
    if (stepId === "farms") {
      return selectedFarm ? "completed" : currentStep === "farms" ? "current" : "upcoming"
    }
    if (stepId === "trees") {
      return selectedTree ? "completed" : currentStep === "trees" ? "current" : "upcoming"
    }
    if (stepId === "upload") {
      return currentStep === "upload" ? "current" : "upcoming"
    }
    return "upcoming"
  }

  return (
    <div className="relative w-full">
      {/* Progress Line */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-10">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: currentStep === "farms" ? "0%" : currentStep === "trees" ? "50%" : "100%",
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between max-w-md">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  status === "completed"
                    ? "bg-primary border-primary text-primary-foreground shadow-lg"
                    : status === "current"
                      ? "bg-primary border-primary text-primary-foreground shadow-lg scale-110"
                      : "bg-background border-border text-muted-foreground"
                }`}
              >
                {status === "completed" ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              {/* Step Label */}
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">Step {index + 1}</p>
                <p
                  className={`text-xs font-medium ${
                    status === "current"
                      ? "text-primary"
                      : status === "completed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
