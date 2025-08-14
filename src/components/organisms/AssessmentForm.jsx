import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SeveritySlider from "@/components/molecules/SeveritySlider";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import assessmentService from "@/services/api/assessmentService";
import { toast } from "react-toastify";

const AssessmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    patientId: "",
    chiefComplaint: "",
    symptoms: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const commonSymptoms = [
    { name: "Fever", category: "General" },
    { name: "Headache", category: "Neurological" },
    { name: "Nausea", category: "Gastrointestinal" },
    { name: "Vomiting", category: "Gastrointestinal" },
    { name: "Chest Pain", category: "Cardiovascular" },
    { name: "Shortness of Breath", category: "Respiratory" },
    { name: "Cough", category: "Respiratory" },
    { name: "Sore Throat", category: "Respiratory" },
    { name: "Abdominal Pain", category: "Gastrointestinal" },
    { name: "Diarrhea", category: "Gastrointestinal" },
    { name: "Constipation", category: "Gastrointestinal" },
    { name: "Dizziness", category: "Neurological" },
    { name: "Fatigue", category: "General" },
    { name: "Joint Pain", category: "Musculoskeletal" },
    { name: "Muscle Aches", category: "Musculoskeletal" },
    { name: "Rash", category: "Dermatological" },
    { name: "Back Pain", category: "Musculoskeletal" },
    { name: "Anxiety", category: "Psychological" },
    { name: "Sleep Issues", category: "General" },
    { name: "Loss of Appetite", category: "General" }
  ];

  useEffect(() => {
    if (isEditing) {
      loadAssessment();
    } else {
      initializeSymptoms();
    }
  }, [id, isEditing]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const assessment = await assessmentService.getById(parseInt(id));
      setFormData(assessment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeSymptoms = () => {
    const symptoms = commonSymptoms.map((symptom, index) => ({
      Id: index + 1,
      name: symptom.name,
      category: symptom.category,
      severity: 0,
      notes: ""
    }));
    
    setFormData(prev => ({ ...prev, symptoms }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomSeverityChange = (symptomId, severity) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(symptom =>
        symptom.Id === symptomId ? { ...symptom, severity } : symptom
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId.trim() || !formData.chiefComplaint.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      
      const assessmentData = {
        ...formData,
        status: formData.symptoms.some(s => s.severity > 0) ? "In Progress" : "Draft",
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await assessmentService.update(parseInt(id), assessmentData);
        toast.success("Assessment updated successfully");
      } else {
        await assessmentService.create(assessmentData);
        toast.success("Assessment created successfully");
      }
      
      navigate("/assessments");
    } catch (err) {
      toast.error(isEditing ? "Failed to update assessment" : "Failed to create assessment");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/assessments");
  };

  const groupedSymptoms = commonSymptoms.reduce((groups, symptom) => {
    if (!groups[symptom.category]) {
      groups[symptom.category] = [];
    }
    groups[symptom.category].push(symptom);
    return groups;
  }, {});

  if (loading) return <Loading variant="form" />;
  if (error) return <Error message={error} onRetry={loadAssessment} />;

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">
          {isEditing ? "Edit Assessment" : "New Patient Assessment"}
        </h2>
        <p className="text-surface-600">
          Enter patient information and symptom severity ratings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-surface-900 border-b border-surface-200 pb-2">
            Patient Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Patient ID"
              required
              value={formData.patientId}
              onChange={(e) => handleInputChange("patientId", e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>

          <FormField
            label="Chief Complaint"
            required
            value={formData.chiefComplaint}
            onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
            placeholder="Describe the patient's primary concern"
          />
        </div>

        {/* Symptom Assessment */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-surface-900 border-b border-surface-200 pb-2">
            Symptom Assessment
          </h3>
          <p className="text-sm text-surface-600 mb-4">
            Rate the severity of each symptom on a scale of 0-5 (0 = None, 5 = Critical)
          </p>

          {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-md font-medium text-surface-800 bg-surface-50 px-4 py-2 rounded-lg">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                {symptoms.map((symptom, index) => {
                  const symptomData = formData.symptoms.find(s => s.name === symptom.name);
                  const symptomId = commonSymptoms.findIndex(s => s.name === symptom.name) + 1;
                  
                  return (
                    <SeveritySlider
                      key={symptom.name}
                      symptomName={symptom.name}
                      value={symptomData?.severity || 0}
                      onChange={(severity) => handleSymptomSeverityChange(symptomId, severity)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-surface-200">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex-1 sm:flex-none"
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {isEditing ? "Update Assessment" : "Create Assessment"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AssessmentForm;