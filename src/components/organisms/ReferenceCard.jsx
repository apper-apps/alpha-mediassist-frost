import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ReferenceCard = ({ reference }) => {
const getTypeVariant = (type_c) => {
    switch (type_c) {
      case "Calculator": return "primary";
      case "Drug Reference": return "accent";
      case "Guidelines": return "secondary";
      case "Diagnostic Tool": return "warning";
      default: return "default";
    }
  };

const getTypeIcon = (type_c) => {
    switch (type_c) {
      case "Calculator": return "Calculator";
      case "Drug Reference": return "Pill";
      case "Guidelines": return "FileText";
      case "Diagnostic Tool": return "Search";
      default: return "Book";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-surface-100">
<ApperIcon name={getTypeIcon(reference.type_c)} className="h-5 w-5 text-surface-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-surface-900">
                {reference.title_c}
              </h3>
              <Badge variant={getTypeVariant(reference.type_c)} className="mt-1">
                {reference.type_c}
              </Badge>
            </div>
          </div>
<p className="text-surface-600 text-sm mb-3">
            {reference.description_c}
          </p>
          {reference.usage_c && (
            <p className="text-xs text-surface-500">
              Common use: {reference.usage_c}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-surface-100">
        <Button variant="primary" size="sm" className="w-full">
          <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
Use {reference.type_c}
        </Button>
      </div>
    </Card>
  );
};

export default ReferenceCard;