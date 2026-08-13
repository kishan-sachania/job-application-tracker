import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import type { JobApplication, JobApplicationInput } from "../types";
import { Status, Location } from "../types";
import { getErrorMessage } from "../utils/error";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobApplicationInput) => Promise<void>;
  initialData?: JobApplication | null;
}

interface ApplicationFormData {
  company: string;
  role: string;
  status: Status;
  location: Location;
  appliedDate: string;
  nextFollowUpDate: string;
  salaryExpectation: string;
  notes: string;
}

const getInitialValues = (data?: JobApplication | null): ApplicationFormData => {
  const todayStr = new Date().toISOString().split("T")[0];
  if (data) {
    return {
      company: data.company || "",
      role: data.role || "",
      status: data.status || Status.Applied,
      location: data.location || Location.Remote,
      appliedDate: data.appliedDate
        ? new Date(data.appliedDate).toISOString().split("T")[0]
        : todayStr,
      nextFollowUpDate: data.nextFollowUpDate
        ? new Date(data.nextFollowUpDate).toISOString().split("T")[0]
        : "",
      salaryExpectation:
        data.salaryExpectation !== undefined && data.salaryExpectation !== null
          ? String(data.salaryExpectation)
          : "",
      notes: data.notes || "",
    };
  }
  return {
    company: "",
    role: "",
    status: Status.Applied,
    location: Location.Remote,
    appliedDate: todayStr,
    nextFollowUpDate: "",
    salaryExpectation: "",
    notes: "",
  };
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    defaultValues: getInitialValues(initialData),
  });

  useEffect(() => {
    if (isOpen) {
      reset(getInitialValues(initialData));
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: ApplicationFormData) => {
    try {
      const payload: JobApplicationInput = {
        company: data.company.trim(),
        role: data.role.trim(),
        status: data.status,
        location: data.location,
        appliedDate: data.appliedDate,
        nextFollowUpDate: data.nextFollowUpDate || undefined,
        salaryExpectation:
          data.salaryExpectation !== "" ? Number(data.salaryExpectation) : undefined,
        notes: data.notes.trim() || undefined,
      };
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save job application");
      setError("root", { type: "manual", message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Job Application" : "New Job Application"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4 overflow-y-auto">
          {errors.root && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 p-3 rounded-md text-sm">
              {errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Company *
              </label>
              <input
                type="text"
                {...register("company", {
                  required: "Company is required",
                  validate: (val) => val.trim().length > 0 || "Company is required",
                })}
                placeholder="Google, Stripe, etc."
                className={`w-full bg-slate-50 dark:bg-slate-800 border ${
                  errors.company ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                } rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.company && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                {...register("role", {
                  required: "Role is required",
                  validate: (val) => val.trim().length > 0 || "Role is required",
                })}
                placeholder="Frontend Engineer"
                className={`w-full bg-slate-50 dark:bg-slate-800 border ${
                  errors.role ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                } rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.role && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Pipeline Status
              </label>
              <select
                {...register("status")}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
              >
                {Object.values(Status).map((st) => (
                  <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Location Type
              </label>
              <select
                {...register("location")}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
              >
                {Object.values(Location).map((loc) => (
                  <option key={loc} value={loc} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Applied Date *
              </label>
              <input
                type="date"
                max={todayStr}
                {...register("appliedDate", {
                  required: "Applied date is required",
                  validate: (val) => {
                    if (!val) return "Applied date is required";
                    const selected = new Date(val);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    if (selected > today) {
                      return "Applied date cannot be in the future";
                    }
                    return true;
                  },
                })}
                className={`w-full bg-slate-50 dark:bg-slate-800 border ${
                  errors.appliedDate ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                } rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.appliedDate && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.appliedDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Next Follow-up Date
              </label>
              <input
                type="date"
                {...register("nextFollowUpDate")}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Salary Expectation ($/yr)
            </label>
            <input
              type="number"
              {...register("salaryExpectation")}
              placeholder="120000"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Notes / Contacts
            </label>
            <textarea
              rows={3}
              {...register("notes")}
              placeholder="Recruiter contact, interview prep notes, referral source..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-md text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-md text-sm shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Application" : "Create Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;

