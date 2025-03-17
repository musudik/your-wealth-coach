import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/ProgressBar';

interface Step {
  title: string;
  component: React.ComponentType<any>;
}

interface FormTemplateProps {
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  steps?: Step[];
  isSubmitting?: boolean;
  isSubmitted?: boolean;
  showProgress?: boolean;
  children?: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  renderSuccessMessage?: () => ReactNode;
  customActions?: ReactNode;
  hideDefaultActions?: boolean;
}

export function FormTemplate({
  title,
  subtitle,
  currentStep = 0,
  totalSteps = 1,
  steps = [],
  isSubmitting = false,
  isSubmitted = false,
  showProgress = false,
  children,
  onPrevious,
  onNext,
  onSubmit,
  renderSuccessMessage,
  customActions,
  hideDefaultActions = false,
}: FormTemplateProps) {
  // Default success message if none provided
  const defaultSuccessMessage = () => (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-medium text-gray-900">Form Submitted Successfully</h2>
      <p className="mt-2 text-sm text-gray-500">
        Thank you for submitting your form. You will receive a confirmation email shortly.
      </p>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            {renderSuccessMessage ? renderSuccessMessage() : defaultSuccessMessage()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>

          {showProgress && steps.length > 1 && (
            <ProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepTitles={steps.map(step => step.title)}
            />
          )}

          <div className="mt-8">
            {children}
          </div>

          {!isSubmitted && (
            <>
              {customActions}
              {!hideDefaultActions && (
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <Button onClick={onPrevious} variant="outline">
                      Previous
                    </Button>
                  )}
                  {currentStep < totalSteps - 1 ? (
                    <Button onClick={onNext}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={onSubmit} disabled={isSubmitting}>
                      Submit
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 