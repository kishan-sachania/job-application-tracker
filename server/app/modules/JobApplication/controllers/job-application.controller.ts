
import { Request, Response } from "express";
import { deleteApplication, getAllJobApplications, registerApplication, updateApplication } from "../services/job-application.service.js";
import ApiResponse from "../../../../utils/api-response.js";
import { CustomError } from "../../../error-formates/error-formates.js";

const normalizeUserId = (req: Request) => {
    const header = req.headers['x-user-id']
    const userId = Array.isArray(header) ? header[0] : header;
    return userId ? String(userId) : null;
}

const getParamsId = (req: Request) => {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("Job ID is required", 400);
    }
    const paramsId = Array.isArray(id) ? id[0] : id;
    return paramsId;
}

// GET
const getAllJobApplication = async (req: Request, res: Response) => {
    try {
        const userId = normalizeUserId(req);
        if (!userId) {
            return ApiResponse.error(res, "Missing user ID", 400);
        }
        const { status, search, sort, order } = req.query;

        const applications = await getAllJobApplications((userId), {
            status: String(status ?? ""),
            search: String(search ?? ""),
            sort: String(sort ?? ""),
            order: String(order ?? "") as "asc" | "desc"
        })

        ApiResponse.success(res, "Applications fetched successfully", 200, applications);
    } catch (error) {
        if (error instanceof CustomError) {
            return ApiResponse.error(res, error.message, error.statusCode);
        }
        return ApiResponse.error(res, "Internal server error", 500);
    }
}

const applyToJobApplication = async (req: Request, res: Response) => {
    try {
        const userId = normalizeUserId(req);
        if (!userId) {
            return ApiResponse.error(res, "Missing user ID", 400);
        }
        const body = req.body;
        const newApplication = await registerApplication(userId, body);
        ApiResponse.success(res, "Application applied successfully", 201, newApplication);
    } catch (error) {
        if (error instanceof CustomError) {
            return ApiResponse.error(res, error.message, error.statusCode);
        }
        return ApiResponse.error(res, "Internal server error", 500);
    }
}

const updateJobApplicationStatus = async (req: Request, res: Response) => {
    try {
        const userId = normalizeUserId(req);
        const id = getParamsId(req)
        if (!userId) {
            return ApiResponse.error(res, "Missing user ID", 400);
        }
        const body = req.body;
        const updated = await updateApplication(id, userId, body);
        ApiResponse.success(res, "Application updated successfully", 200, updated);
    } catch (error) {
        if (error instanceof CustomError) {
            return ApiResponse.error(res, error.message, error.statusCode);
        }
        return ApiResponse.error(res, "Internal server error", 500);
    }
}

const deleteJobApplication = async (req: Request, res: Response) => {
    try {
        const userId = normalizeUserId(req);
        const id = getParamsId(req);
        if (!userId) {
            return ApiResponse.error(res, "Missing user ID", 400);
        }
        await deleteApplication(id, userId);
        ApiResponse.success(res, "Application deleted successfully", 200);
    } catch (error) {
        if (error instanceof CustomError) {
            return ApiResponse.error(res, error.message, error.statusCode);
        }
        return ApiResponse.error(res, "Internal server error", 500);
    }
}

export { getAllJobApplication, applyToJobApplication, updateJobApplicationStatus, deleteJobApplication }