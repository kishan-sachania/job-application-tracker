import { Router } from 'express';
import {
    getAllJobApplication,
    getJobApplicationStats,
    applyToJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication
} from '../controllers/job-application.controller.js';

const router = Router();

router.get('/', getAllJobApplication);
router.get('/stats', getJobApplicationStats);
router.post('/', applyToJobApplication);
router.put('/:id', updateJobApplicationStatus);
router.delete('/:id', deleteJobApplication);

export default router;