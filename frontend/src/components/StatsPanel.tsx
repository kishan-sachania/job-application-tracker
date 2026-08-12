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
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
      accent: "from-blue-500/20 to-indigo-500/20 border-slate-800",
    },
    {
      title: "Applied",
      value: stats.counts[Status.Applied],
      subtitle: "Initial Stage",
      key: Status.Applied,
      badgeColor: STATUS_COLORS[Status.Applied].badge,
      accent: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    },
    {
      title: "Screening",
      value: stats.counts[Status.Screening],
      subtitle: "Recruiter Chat",
      key: Status.Screening,
      badgeColor: STATUS_COLORS[Status.Screening].badge,
      accent: "from-amber-500/10 to-amber-600/10 border-amber-500/20",
    },
    {
      title: "Interview",
      value: stats.counts[Status.Interview],
      subtitle: "Technical & Cultural",
      key: Status.Interview,
      badgeColor: STATUS_COLORS[Status.Interview].badge,
      accent: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
    },
    {
      title: "Offer",
      value: stats.counts[Status.Offer],
      subtitle: "Received Offers",
      key: Status.Offer,
      badgeColor: STATUS_COLORS[Status.Offer].badge,
      accent: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      subtitle: "Screening + Interview + Offer",
      key: "responseRate",
      badgeColor: "bg-indigo-900/60 text-indigo-300 border-indigo-700/50",
      accent: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
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
            className={`p-4 rounded-md border bg-gradient-to-br ${
              card.accent
            } bg-slate-900/80 backdrop-blur-sm shadow-md transition-all duration-200 ${
              isClickable
                ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:border-slate-600"
                : ""
            } ${isSelected ? "ring-2 ring-blue-500 border-blue-500 shadow-blue-500/10" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                {card.title}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 truncate">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsPanel;
