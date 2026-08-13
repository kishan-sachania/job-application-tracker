import { Search, X, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Status } from "../types";

interface SearchFilterProps {
  searchTerm: string;
  statusFilter: string;
  sortField: string;
  onSearchChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onStatusChange: (status: string) => void;
  onSortFieldChange: (field: string) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onAddNew: () => void;
}

export const SearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  sortField,
  sortOrder,
  onStatusChange,
  onSortFieldChange,
  onSortOrderChange,
  onAddNew,
}:SearchFilterProps) => {
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-xs backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 text-sm transition duration-150"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-900">All Statuses</option>
              {Object.values(Status).map((st) => (
                <option key={st} value={st} className="bg-white dark:bg-slate-900">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Field & Order */}
          <div className="flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md px-3 py-2.5 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="appliedDate" className="bg-white dark:bg-slate-900">Sort: Applied Date</option>
              <option value="company" className="bg-white dark:bg-slate-900">Sort: Company</option>
              <option value="role" className="bg-white dark:bg-slate-900">Sort: Role</option>
              <option value="nextFollowUpDate" className="bg-white dark:bg-slate-900">Sort: Follow-up Date</option>
            </select>

            <button
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition cursor-pointer"
            >
              {sortOrder === "asc" ? (
                <>
                  <ArrowUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Asc
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Desc
                </>
              )}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange("");
                onStatusChange("");
              }}
              className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          {/* Add New Application Button */}
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-md shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
