import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import AssessmentCard from "@/components/organisms/AssessmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import assessmentService from "@/services/api/assessmentService";

const Assessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    filterAssessments();
  }, [assessments, searchQuery, statusFilter]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentService.getAll();
      setAssessments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAssessments = () => {
    let filtered = assessments;

    if (searchQuery) {
      filtered = filtered.filter(assessment =>
        assessment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(assessment => assessment.status === statusFilter);
    }

    setFilteredAssessments(filtered);
  };

  const handleCreateNew = () => {
    navigate("/assessments/new");
  };

  const handleDeleteAssessment = (assessmentId) => {
    setAssessments(prev => prev.filter(assessment => assessment.Id !== assessmentId));
  };

  const statusOptions = ["All", "Draft", "In Progress", "Complete"];

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadAssessments} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Patient Assessments</h1>
          <p className="text-surface-600 mt-1">
            Manage and track patient assessments and diagnoses
          </p>
        </div>
        <Button onClick={handleCreateNew} variant="primary">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by Patient ID or chief complaint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 border border-surface-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      {assessments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-surface-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100">
                <ApperIcon name="FileText" className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Assessments</p>
                <p className="text-2xl font-bold text-surface-900">{assessments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-surface-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-100">
                <ApperIcon name="Clock" className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">In Progress</p>
                <p className="text-2xl font-bold text-surface-900">
                  {assessments.filter(a => a.status === "In Progress").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-surface-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Complete</p>
                <p className="text-2xl font-bold text-surface-900">
                  {assessments.filter(a => a.status === "Complete").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment List */}
      {filteredAssessments.length === 0 && assessments.length > 0 ? (
        <Empty
          title="No matching assessments"
          description="Try adjusting your search criteria or filters."
          icon="Search"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("All");
          }}
        />
      ) : filteredAssessments.length === 0 ? (
        <Empty
          title="No assessments yet"
          description="Create your first patient assessment to get started with clinical decision support."
          icon="ClipboardList"
          actionLabel="Create First Assessment"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment.Id}
              assessment={assessment}
              onDelete={handleDeleteAssessment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments;