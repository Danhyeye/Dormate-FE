import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2 text-gray-400 mb-6">
        <ArrowLeft size={16} />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-[300px] md:h-[400px] rounded-lg" />
        </div>

        {/* Right column - Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-3/4 mb-2" />
              <div className="flex items-start gap-1">
                <Skeleton className="h-4 w-4 mt-1 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-7 w-32" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 