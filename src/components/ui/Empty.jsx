import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  icon = "FileText"
}) => {
  return (
    <Card className="p-12">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-surface-100 mb-6">
          <ApperIcon name={icon} className="h-10 w-10 text-surface-400" />
        </div>
        <h3 className="text-xl font-semibold text-surface-900 mb-3">
          {title}
        </h3>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          {description}
        </p>
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;