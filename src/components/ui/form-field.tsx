interface FormFieldProps {
  label: string;
  subLabel?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, subLabel, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {subLabel && (
          <span className="text-xs  block">{subLabel}</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 