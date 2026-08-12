import { Router } from 'express';
import { loginUser, logout, refreshToken, registerUser } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import ApiResponse from '../../../../utils/api-response.js';

const router = Router();

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.get('/me', authenticateToken, (req: any, res) => {
  return ApiResponse.success(res, "Authenticated user profile", 200, { user: req.user });
});

export default router;