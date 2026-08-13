import { Types } from 'mongoose';
import { IJobApplication, JobApplication } from '../../../models/job-application-model.js';
import { CustomError } from '../../../error-formates/error-formates.js';

export interface GetApplicationsOptions {
    status?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}


// GET
export const getAllJobApplications = async (
    userId: string,
    options: GetApplicationsOptions = {}
) => {
    const { status, search, sort = 'appliedDate', order = 'desc' } = options;

    const matchStage: Record<string, any> = {
        userId: new Types.ObjectId(userId)
    }

    if (status && status.trim() !== "") {
        matchStage.status = status;
    }

    if (search && search.trim() !== "") {
        matchStage.$or = [
            { company: { $regex: search.trim(), $options: 'i' } },
            { role: { $regex: search.trim(), $options: 'i' } }
        ]
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortStage: Record<string, 1 | -1> = { [sort || 'appliedDate']: sortOrder };

    const pipeline = [
        { $match: matchStage },
        { $sort: sortStage },
    ];

    const result = await JobApplication.aggregate(pipeline);
    return result.map(({ _id, __v, ...rest }: any) => ({
        id: _id ? _id.toString() : rest.id,
        ...rest,
    }));
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
    const job = await JobApplication.findOne({ _id: id });
    if (!job) {
        throw new CustomError('Application not found', 404);
    }
    if (job.userId.toString() !== userId) {
        throw new CustomError('Unauthorized to update this application', 403);
    }
    await JobApplication.updateOne({ _id: id }, { $set: data });
    return await JobApplication.findById(id);
}


export const deleteApplication = async (id: string, userId: string) => {
    const job = await JobApplication.findOne({ _id: id });
    if (!job) {
        throw new CustomError('Application not found', 404);
    }
    if (job.userId.toString() !== userId) {
        throw new CustomError('Unauthorized to delete this application', 403);
    }
    await JobApplication.deleteOne({ _id: id });
}