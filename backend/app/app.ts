import express from 'express';
import userRoutes from './modules/User/router/user.router.js';
import jobRoutes from './modules/JobApplication/router/job-application.router.js';

const app = express();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/applications', jobRoutes);

export default app;