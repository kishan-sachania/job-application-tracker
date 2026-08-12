import { model, Schema, Types } from 'mongoose'
import { Location, Status } from '../../utils/job-application-enum.js';

export interface IJobApplication {
    company: string;
    role: string;
    status: Status;
    location: Location;
    appliedDate: Date;
    nextFollowUpDate?: Date;
    salaryExpectation?: number;
    notes?: string;
    userId: Types.ObjectId;
}

const jobApplicationSchema = new Schema<IJobApplication>({
    company: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Status,
    },
    location: {
        type: String,
        enum: Location,
    },
    appliedDate: {
        type: Date,
        required: true,
    },
    nextFollowUpDate: {
        type: Date,
    },
    salaryExpectation: {
        type: Number,
    },
    notes: {
        type: String,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true })

jobApplicationSchema.set("toJSON", {
  transform: (doc: any, ret: Record<string, any>) => {
    ret.id = ret._id;
    delete ret.__v;
  },
});

export const JobApplication = model<IJobApplication>('JobApplication', jobApplicationSchema)