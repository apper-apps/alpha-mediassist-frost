import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import ReferenceCard from "@/components/organisms/ReferenceCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import referenceService from "@/services/api/referenceService";

const Reference = () => {
  const [references, setReferences] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    loadReferences();
  }, []);

  useEffect(() => {
    filterReferences();
  }, [references, searchQuery, typeFilter]);

  const loadReferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await referenceService.getAll();
      setReferences(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterReferences = () => {
    let filtered = references;

    if (searchQuery) {
      filtered = filtered.filter(reference =>
        reference.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reference.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter(reference => reference.type === typeFilter);
    }

    setFilteredReferences(filtered);
  };

  const types = ["All", ...new Set(references.map(r => r.type))];

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadReferences} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Medical Reference</h1>
          <p className="text-surface-600 mt-1">
            Quick access to medical calculators, drug references, and diagnostic tools
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-surface-600">
          <ApperIcon name="Library" className="h-4 w-4" />
          <span>{references.length} references available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search references by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-10 px-3 border border-surface-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Access */}
      {references.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-500">
                <ApperIcon name="Calculator" className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">Calculators</p>
                <p className="text-2xl font-bold text-primary-900">
                  {references.filter(r => r.type === "Calculator").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-lg border border-accent-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent-500">
                <ApperIcon name="Pill" className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-900">Drug Reference</p>
                <p className="text-2xl font-bold text-accent-900">
                  {references.filter(r => r.type === "Drug Reference").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary-500">
                <ApperIcon name="FileText" className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Guidelines</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {references.filter(r => r.type === "Guidelines").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-500">
                <ApperIcon name="Search" className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900">Diagnostic Tools</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {references.filter(r => r.type === "Diagnostic Tool").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reference List */}
      {filteredReferences.length === 0 && references.length > 0 ? (
        <Empty
          title="No matching references"
          description="Try adjusting your search criteria or filters."
          icon="Search"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setTypeFilter("All");
          }}
        />
      ) : filteredReferences.length === 0 ? (
        <Empty
          title="No references available"
          description="Medical references and tools will be displayed here when available."
          icon="Library"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReferences.map((reference) => (
            <ReferenceCard key={reference.Id} reference={reference} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reference;