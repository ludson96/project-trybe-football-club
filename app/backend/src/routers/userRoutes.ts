import { Router } from 'express';
import UserController from '../controllers/UserController';
import validEmailPwd from '../middlewares/validEmailPwd';
import validateJwt from '../auth/validateJwt';

const router = Router();

const userController = new UserController();

router.post('/', validEmailPwd.emailPwd, userController.login);

router.get('/validate', validateJwt.validateToken, userController.getRole);

export { userController };
export default router;
