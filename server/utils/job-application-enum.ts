export const Status = {
    Applied: "Applied",
    Screening: "Screening",
    Interview: "Interview",
    Offer: "Offer",
    Closed: "Closed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Location = {
    Remote: "remote",
    Onsite: "onsite",
    Hybrid: "hybrid",
} as const;

export type Location = (typeof Location)[keyof typeof Location] | "Remote" | "Onsite" | "Hybrid" | "Office";