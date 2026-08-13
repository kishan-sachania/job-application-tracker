import { Types } from 'mongoose';
import { IJobApplication, JobApplication } from '../../../models/job-application-model.js';
import { CustomError } from '../../../error-formates/error-formates.js';

export interface GetApplicationsOptions {
    status?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

const buildMatch = (userId: string, status?: string, search?: string) => {
    const match: Record<string, any> = { userId: new Types.ObjectId(userId) };
    if (status?.trim()) match.status = status;
    if (search?.trim()) {
        match.$or = [
            { company: { $regex: search.trim(), $options: 'i' } },
            { role: { $regex: search.trim(), $options: 'i' } },
        ];
    }
    return match;
};


// GET
export const getAllJobApplications = async (userId: string, options: GetApplicationsOptions = {}) => {
    const { status, search, sort = 'appliedDate', order = 'desc', page = 1, limit = 10 } = options;
    const match = buildMatch(userId, status, search);

    const [applications, total] = await Promise.all([
        JobApplication.find(match)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        JobApplication.countDocuments(match),
    ]);

    return {
        applications,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}

export const getApplicationStats = async (userId: string) => {
    const uid = new Types.ObjectId(userId);
    const [statusCounts, overdueFollowUps] = await Promise.all([
        JobApplication.aggregate([
            { $match: { userId: uid } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        JobApplication.countDocuments({
            userId: uid,
            status: { $ne: 'Closed' },
            nextFollowUpDate: { $lte: new Date() },
        }),
    ]);

    const counts: Record<string, number> = { Applied: 0, Screening: 0, Interview: 0, Offer: 0, Closed: 0 };
    let total = 0;
    statusCounts.forEach(({ _id, count }: any) => {
        if (_id in counts) counts[_id] = count;
        total += count;
    });

    const responseRate = total ? Math.round(((counts.Screening + counts.Interview + counts.Offer) / total) * 100) : 0;

    return { counts, total, responseRate, overdueFollowUps };
};


export const registerApplication = async (userId: string, data: IJobApplication) => {
    if (!data.appliedDate) {
        throw new CustomError('appliedDate is required', 400);
    }
    const appliedDate = new Date(data.appliedDate);

    if (appliedDate > new Date()) {
        throw new CustomError('appliedDate cannot be in the future', 400);
    }

    const jobApplication = await JobApplication.create({
        ...data,
        appliedDate,
        userId,
    })

    return jobApplication;
}

export const updateApplication = async (id: string, userId: string, data: Partial<IJobApplication>) => {
    const updated = await JobApplication.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true }
    );
    if (!updated) {
        throw new CustomError('Application not found', 404);
    }
    return updated;
};

export const deleteApplication = async (id: string, userId: string) => {
    const deleted = await JobApplication.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
        throw new CustomError('Application not found', 404);
    }
};