import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.",
  onRetry,
  showRetry = true
}) => {
  return (
    <Card className="p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-surface-600 mb-6 max-w-md mx-auto">
          {message}
        </p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;