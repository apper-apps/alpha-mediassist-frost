import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ProtocolCard = ({ protocol }) => {
  const getCategoryVariant = (category) => {
    switch (category) {
      case "Emergency": return "error";
      case "Cardiology": return "primary";
      case "Neurology": return "secondary";
      case "Gastroenterology": return "accent";
      case "Respiratory": return "warning";
      default: return "default";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
<h3 className="text-lg font-semibold text-surface-900">
              {protocol.title_c}
            </h3>
            <Badge variant={getCategoryVariant(protocol.category_c)}>
              {protocol.category_c}
            </Badge>
          </div>
<p className="text-surface-600 text-sm line-clamp-2 mb-3">
            {protocol.content_c.substring(0, 150)}...
          </p>
          <p className="text-xs text-surface-500">
            Last updated: {format(new Date(protocol.last_updated_c), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-surface-100">
        <Button variant="outline" size="sm" className="w-full">
          <ApperIcon name="BookOpen" className="h-4 w-4 mr-2" />
          View Protocol
        </Button>
      </div>
    </Card>
  );
};

export default ProtocolCard;