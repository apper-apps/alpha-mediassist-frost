import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import assessmentService from "@/services/api/assessmentService";
import { toast } from "react-toastify";

const AssessmentCard = ({ assessment, onDelete }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case "Complete": return "success";
      case "In Progress": return "warning";
      case "Draft": return "default";
      default: return "default";
    }
  };

  const getSeverityCount = (symptoms) => {
    const severeCounts = { mild: 0, moderate: 0, severe: 0 };
    
    symptoms.forEach(symptom => {
      if (symptom.severity >= 1 && symptom.severity <= 2) severeCounts.mild++;
      else if (symptom.severity >= 3 && symptom.severity <= 3) severeCounts.moderate++;
      else if (symptom.severity >= 4) severeCounts.severe++;
    });
    
    return severeCounts;
  };

  const handleEdit = () => {
    navigate(`/assessments/${assessment.Id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        await assessmentService.delete(assessment.Id);
        toast.success("Assessment deleted successfully");
        onDelete(assessment.Id);
      } catch (error) {
        toast.error("Failed to delete assessment");
      }
    }
  };

  const severityCount = getSeverityCount(assessment.symptoms_c || []);
  const totalSymptoms = assessment.symptoms_c?.filter(s => s.severity > 0).length || 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-surface-900">
              Patient ID: {assessment.patient_id_c}
            </h3>
            <Badge variant={getStatusVariant(assessment.status_c)}>
              {assessment.status_c}
            </Badge>
          </div>
          <p className="text-surface-700 font-medium mb-1">
            {assessment.chief_complaint_c}
          </p>
          <p className="text-sm text-surface-500">
            Created: {format(new Date(assessment.created_at_c), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-surface-700">Symptoms Recorded:</span>
          <span className="text-surface-900 font-semibold">{totalSymptoms}</span>
        </div>
        
        {totalSymptoms > 0 && (
          <div className="space-y-2">
            {severityCount.severe > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-surface-600">Severe Symptoms</span>
                </div>
                <span className="font-semibold text-red-600">{severityCount.severe}</span>
              </div>
            )}
            {severityCount.moderate > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-surface-600">Moderate Symptoms</span>
                </div>
                <span className="font-semibold text-orange-600">{severityCount.moderate}</span>
              </div>
            )}
            {severityCount.mild > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-surface-600">Mild Symptoms</span>
                </div>
                <span className="font-semibold text-green-600">{severityCount.mild}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-surface-100">
        <Button variant="primary" size="sm" onClick={handleEdit} className="w-full">
          <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
          View Assessment
        </Button>
      </div>
    </Card>
  );
};

export default AssessmentCard;