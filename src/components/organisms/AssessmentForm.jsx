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
  
  const [expandedCategories, setExpandedCategories] = useState({
    "Cardiovascular": true,
    "Respiratory": true,
    "Gastrointestinal": true,
    "Neurological": true,
    "Musculoskeletal": true,
    "Dermatological": true,
    "General": true,
    "Psychological": true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [saving, setSaving] = useState(false);

  const durationOptions = [
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" }
  ];

  const onsetOptions = [
    { value: "sudden", label: "Sudden onset" },
    { value: "gradual", label: "Gradual onset" },
    { value: "intermittent", label: "Intermittent" },
    { value: "constant", label: "Constant" }
  ];
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
      duration: "",
      durationUnit: "days",
      onset: "",
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
const handleSymptomChange = (symptomId, field, value) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(symptom =>
        symptom.Id === symptomId ? { ...symptom, [field]: value } : symptom
      )
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
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

{Object.entries(groupedSymptoms).map(([category, symptoms]) => {
            const isExpanded = expandedCategories[category];
            return (
              <div key={category} className="space-y-4 border border-surface-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full text-left px-4 py-3 bg-surface-50 hover:bg-surface-100 rounded-t-lg flex items-center justify-between transition-colors"
                >
                  <h4 className="text-md font-medium text-surface-800">
                    {category} ({symptoms.length} symptoms)
                  </h4>
                  <ApperIcon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-surface-600" 
                  />
                </button>
                
                {isExpanded && (
                  <div className="p-4 space-y-6">
                    {symptoms.map((symptom) => {
                      const symptomData = formData.symptoms.find(s => s.name === symptom.name);
                      const symptomId = commonSymptoms.findIndex(s => s.name === symptom.name) + 1;
                      
                      return (
                        <div key={symptom.name} className="space-y-4 p-4 bg-surface-50 rounded-lg">
                          <SeveritySlider
                            symptomName={symptom.name}
                            value={symptomData?.severity || 0}
                            onChange={(severity) => handleSymptomSeverityChange(symptomId, severity)}
                          />
                          
                          {(symptomData?.severity || 0) > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-surface-700">Duration</label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="Duration"
                                    value={symptomData?.duration || ""}
                                    onChange={(e) => handleSymptomChange(symptomId, "duration", e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-surface-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  />
                                  <select
                                    value={symptomData?.durationUnit || "days"}
                                    onChange={(e) => handleSymptomChange(symptomId, "durationUnit", e.target.value)}
                                    className="px-3 py-2 text-sm border border-surface-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  >
                                    {durationOptions.map(option => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-surface-700">Onset</label>
                                <select
                                  value={symptomData?.onset || ""}
                                  onChange={(e) => handleSymptomChange(symptomId, "onset", e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                  <option value="">Select onset type</option>
                                  {onsetOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-medium text-surface-700">Additional Notes</label>
                                <textarea
                                  placeholder="Any additional details about this symptom..."
                                  value={symptomData?.notes || ""}
                                  onChange={(e) => handleSymptomChange(symptomId, "notes", e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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