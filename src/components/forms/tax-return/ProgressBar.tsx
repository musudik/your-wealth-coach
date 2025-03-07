import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps,
  stepTitles 
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full">
      {/* Step counter */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {stepTitles && (
          <span className="text-sm font-medium text-blue-600">
            {stepTitles[currentStep]}
          </span>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Mobile-friendly step indicators */}
      <div className="flex justify-between mt-2 px-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 