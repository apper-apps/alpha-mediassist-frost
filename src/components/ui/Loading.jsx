import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ variant = "default" }) => {
  if (variant === "list") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-surface-200 rounded w-1/4"></div>
                <div className="h-6 bg-surface-200 rounded-full w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="h-4 bg-surface-200 rounded w-24"></div>
                <div className="h-4 bg-surface-200 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-7 bg-surface-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-surface-200 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-surface-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-surface-200 rounded w-1/3 mb-2"></div>
              <div className="h-24 bg-surface-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-surface-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-surface-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-surface-200 rounded w-24"></div>
              <div className="h-10 bg-surface-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-surface-200 border-t-primary-500"></div>
    </div>
  );
};

export default Loading;