import React from "react";
import { Briefcase, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import type { JobApplication } from "../types";
import { Status } from "../types";
import { STATUS_COLORS } from "../constants/statusColors";

interface ApplicationListProps {
  applications: JobApplication[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

const StatusBadgeCell: React.FC<{
  app: JobApplication;
  onUpdateStatus: (id: string, newStatus: Status) => void;
}> = ({ app, onUpdateStatus }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS[Status.Applied];

  if (isEditing) {
    return (
      <select
        autoFocus
        value={app.status}
        onChange={(e) => {
          onUpdateStatus(app.id, e.target.value as Status);
          setIsEditing(false);
        }}
        onBlur={() => setIsEditing(false)}
        className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-md font-bold"
      >
        {Object.values(Status).map((st) => (
          <option key={st} value={st} className="bg-slate-900 text-slate-200">
            {st}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      title="Click to change status"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.badge} hover:opacity-80 transition cursor-pointer`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
      <span>{app.status}</span>
    </button>
  );
};

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const isFollowUpDue = (app: JobApplication) => {
    if (!app.nextFollowUpDate || app.status === Status.Closed) return false;
    const followUpStr = new Date(app.nextFollowUpDate)
      .toISOString()
      .split("T")[0];
    return followUpStr <= todayStr;
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center my-6">
        <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-white">No Job Applications Found</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
          No applications match your current filter criteria or you haven't added any applications yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl my-6 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Company & Role</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4">Follow-up Date</th>
              <th className="py-3.5 px-4">Salary</th>
              <th className="py-3.5 px-4">Notes</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {applications.map((app) => {
              console.log(app)
              const dueAlert = isFollowUpDue(app);

              return (
                <tr
                  key={app.id}
                  className={`group transition-colors hover:bg-slate-800/50 ${dueAlert ? "bg-amber-950/20" : ""
                    }`}
                >
                  {/* Company & Role */}
                  <td className="py-3.5 px-4 min-w-[180px]">
                    <div className="font-bold text-white tracking-tight group-hover:text-blue-400 transition truncate">
                      {app.company}
                    </div>
                    <div className="text-xs font-medium text-slate-400 truncate">
                      {app.role}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {app.location}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadgeCell app={app} onUpdateStatus={onUpdateStatus} />
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-300">
                    {formatDate(app.appliedDate)}
                  </td>

                  {/* Follow-up Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                    {app.nextFollowUpDate ? (
                      <span
                        className={`font-semibold ${dueAlert
                            ? "text-amber-400 inline-flex items-center gap-1 font-bold animate-pulse"
                            : "text-slate-300"
                          }`}
                      >
                        {dueAlert && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {formatDate(app.nextFollowUpDate)}
                      </span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>

                  {/* Salary Expectation */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-emerald-400">
                    {app.salaryExpectation !== undefined
                      ? `$${Number(app.salaryExpectation).toLocaleString()}`
                      : "-"}
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-4 max-w-[200px] text-xs text-slate-400 truncate">
                    {app.notes ? (
                      <span title={app.notes} className="italic">
                        "{app.notes}"
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(app)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                        title="Edit Application"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete application for ${app.company}?`)) {
                            onDelete(app.id);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
