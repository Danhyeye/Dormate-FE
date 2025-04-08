import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export default function ErrorState({ onRetry, message = "Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại sau." }: ErrorStateProps) {
  return (
    <div className="min-h-[50vh] w-full md:w-3/4 mx-auto px-4 md:px-0 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="border-red-500/50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold mb-2">Rất tiếc!</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {message}
          </AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              className="mt-4 w-full border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
              onClick={onRetry}
            >
              Thử lại
            </Button>
          )}
        </Alert>
      </div>
    </div>
  );
} 