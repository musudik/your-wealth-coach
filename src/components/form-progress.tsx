import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps, progress }: FormProgressProps) {
  return (
    <div className="w-full">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground mt-2">
        
        Step {currentStep} / {totalSteps}
      </p>
    </div>
  );
}
