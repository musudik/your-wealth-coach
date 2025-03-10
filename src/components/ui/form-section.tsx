import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default FormSection; 