import { ArrowLeft } from "lucide-react";
import { useHistory } from "react-router-dom";

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function FormLayout({ title, subtitle, children, showBackButton = true }: FormLayoutProps) {
  const history = useHistory();

  return (
    <div className="container mx-auto   ">
      <div className="flex items-center justify-between ">
        {showBackButton && (
          <button 
            onClick={() => history.goBack()} 
            className="flex items-center"
          >
            <ArrowLeft size={16} />
            <span className="ml-2">Back</span>
          </button>
        )}
        <h2 className=" ">
          {title}
          {subtitle && (
            <span className="text-sm  block">{subtitle}</span>
          )}
        </h2>
      </div>
      {children}
    </div>
  );
} 