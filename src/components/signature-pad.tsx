import { useSignature } from "@/hooks/use-signature";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  initialValue?: string;
}

export function SignaturePad({ onSave, initialValue }: SignaturePadProps) {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    getSignatureData,
    hasSignature
  } = useSignature();

  const handleSave = () => {
    const signature = getSignatureData();
    if (signature) {
      onSave(signature);
    }
  };

  return (
    <div className="flex flex-col bg-white border rounded-md">
      <div className="p-4 w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-[200px] bg-white border rounded-sm touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-between p-2 border-t">
        <Button 
          variant="outline" 
          onClick={clear}
          className="text-sm"
        >
          Clear
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasSignature}
          className="text-sm"
        >
          Confirm Signature
        </Button>
      </div>
    </div>
  );
}