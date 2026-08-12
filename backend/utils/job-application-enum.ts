export const Status = {
    Applied: "Applied",
    Screening: "Screening",
    Interview: "Interview",
    Offer: "Offer",
    Closed: "Closed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Location = {
    Remote: "Remote",
    Office: "Office",
    Hybrid: "Hybrid",
} as const;

export type Location = (typeof Location)[keyof typeof Location];