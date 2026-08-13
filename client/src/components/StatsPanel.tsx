import React from "react";
import type { StatsResponse } from "../types";
import { Status } from "../types";
import { STATUS_COLORS } from "../constants/statusColors";

interface StatsPanelProps {
  stats: StatsResponse;
  activeStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  activeStatusFilter = "",
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      title: "Total Applications",
      value: stats.total,
      subtitle: `${stats.overdueFollowUps} follow-ups due`,
      key: "",
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      accent: "from-blue-50 to-indigo-50/50 dark:from-blue-500/20 dark:to-indigo-500/20 border-slate-200 dark:border-slate-800",
    },
    {
      title: "Applied",
      value: stats.counts[Status.Applied],
      subtitle: "Initial Stage",
      key: Status.Applied,
      badgeColor: STATUS_COLORS[Status.Applied].badge,
      accent: "from-blue-50/80 to-blue-100/30 dark:from-blue-500/10 dark:to-blue-600/10 border-blue-200 dark:border-blue-500/20",
    },
    {
      title: "Screening",
      value: stats.counts[Status.Screening],
      subtitle: "Recruiter Chat",
      key: Status.Screening,
      badgeColor: STATUS_COLORS[Status.Screening].badge,
      accent: "from-amber-50/80 to-amber-100/30 dark:from-amber-500/10 dark:to-amber-600/10 border-amber-200 dark:border-amber-500/20",
    },
    {
      title: "Interview",
      value: stats.counts[Status.Interview],
      subtitle: "Technical & Cultural",
      key: Status.Interview,
      badgeColor: STATUS_COLORS[Status.Interview].badge,
      accent: "from-purple-50/80 to-purple-100/30 dark:from-purple-500/10 dark:to-purple-600/10 border-purple-200 dark:border-purple-500/20",
    },
    {
      title: "Offer",
      value: stats.counts[Status.Offer],
      subtitle: "Received Offers",
      key: Status.Offer,
      badgeColor: STATUS_COLORS[Status.Offer].badge,
      accent: "from-emerald-50/80 to-emerald-100/30 dark:from-emerald-500/10 dark:to-emerald-600/10 border-emerald-200 dark:border-emerald-500/20",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      subtitle: "Screening + Interview + Offer",
      key: "responseRate",
      badgeColor: "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      accent: "from-indigo-50/80 to-purple-50/40 dark:from-indigo-500/20 dark:to-purple-500/20 border-indigo-200 dark:border-indigo-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
      {cards.map((card) => {
        const isSelected = activeStatusFilter === card.key;
        const isClickable = onSelectStatusFilter && card.key !== "responseRate";

        return (
          <div
            key={card.title}
            onClick={() => {
              if (isClickable) {
                onSelectStatusFilter(isSelected ? "" : card.key);
              }
            }}
            className={`p-4 rounded-xl border bg-gradient-to-br ${
              card.accent
            } bg-white dark:bg-slate-900/80 backdrop-blur-sm shadow-xs transition-all duration-200 ${
              isClickable
                ? "cursor-pointer hover:scale-[1.02] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
                : ""
            } ${isSelected ? "ring-2 ring-blue-500 border-blue-500 shadow-blue-500/10" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {card.title}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsPanel;
