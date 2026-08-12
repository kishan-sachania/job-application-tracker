import { Router } from 'express';
import {
    getAllJobApplication,
    applyToJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication
} from '../controllers/job-application.controller.js';

const router = Router();

router.get('/get-applications', getAllJobApplication)
router.post('/apply', applyToJobApplication)
router.patch('/update', updateJobApplicationStatus)
router.delete('/delete', deleteJobApplication)

export default router;