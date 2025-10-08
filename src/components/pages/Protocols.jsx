import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import ProtocolCard from "@/components/organisms/ProtocolCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import protocolService from "@/services/api/protocolService";

const Protocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    loadProtocols();
  }, []);

  useEffect(() => {
    filterProtocols();
  }, [protocols, searchQuery, categoryFilter]);

  const loadProtocols = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await protocolService.getAll();
      setProtocols(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProtocols = () => {
    let filtered = protocols;

    if (searchQuery) {
      filtered = filtered.filter(protocol =>
protocol.title_c.toLowerCase().includes(searchQuery.toLowerCase()) ||
        protocol.content_c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(protocol => protocol.category === categoryFilter);
    }

    setFilteredProtocols(filtered);
  };

const categories = ["All", ...new Set(protocols.map(p => p.category_c))];

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadProtocols} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Clinical Protocols</h1>
          <p className="text-surface-600 mt-1">
            Access clinical guidelines and evidence-based protocols
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-surface-600">
          <ApperIcon name="BookOpen" className="h-4 w-4" />
          <span>{protocols.length} protocols available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search protocols by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-10 px-3 border border-surface-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Overview */}
      {protocols.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.slice(1).map(category => {
const count = protocols.filter(p => p.category_c === category).length;
            return (
              <div key={category} className="bg-white p-4 rounded-lg border border-surface-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{count}</p>
                  <p className="text-sm font-medium text-surface-600">{category}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Protocol List */}
      {filteredProtocols.length === 0 && protocols.length > 0 ? (
        <Empty
          title="No matching protocols"
          description="Try adjusting your search criteria or filters."
          icon="Search"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setCategoryFilter("All");
          }}
        />
      ) : filteredProtocols.length === 0 ? (
        <Empty
          title="No protocols available"
          description="Clinical protocols will be displayed here when available."
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProtocols.map((protocol) => (
            <ProtocolCard key={protocol.Id} protocol={protocol} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Protocols;