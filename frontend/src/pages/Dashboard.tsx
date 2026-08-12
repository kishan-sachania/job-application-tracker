import React, { useState, useEffect } from "react";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../hooks/useApplications";
import { useDebounce } from "../hooks/useDebounce";
import type { JobApplication, JobApplicationInput } from "../types";
import { StatsPanel } from "../components/StatsPanel";
import { SearchFilter } from "../components/SearchFilter";
import { ApplicationList } from "../components/ApplicationList";
import { ApplicationForm } from "../components/ApplicationForm";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    applications,
    loading,
    error,
    stats,
    fetchApplications,
    addApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  } = useApplications();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    fetchApplications({
      search: debouncedSearch,
      status: statusFilter,
      sort: sortField,
      order: sortOrder,
    });
  }, [debouncedSearch, statusFilter, sortField, sortOrder, fetchApplications]);

  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: JobApplication) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: JobApplicationInput) => {
    if (editingApplication) {
      await updateApplication(editingApplication.id, data);
    } else {
      await addApplication(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Job Application Tracker
              </h1>
              <p className="text-xs text-slate-400">
                Pipeline & Follow-up Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">
                {user?.name || "Welcome"}
              </span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-md transition border border-slate-700/80 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-md flex items-center justify-between">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Stats Panel */}
        <StatsPanel
          stats={stats}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Filters Bar */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onAddNew={handleOpenAddModal}
        />

        {/* Applications Grid/List */}
        <ApplicationList
          applications={applications}
          loading={loading}
          onUpdateStatus={updateStatus}
          onEdit={handleOpenEditModal}
          onDelete={deleteApplication}
        />
      </main>

      {/* Application Form Modal */}
      <ApplicationForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingApplication}
      />
    </div>
  );
};

export default Dashboard;
