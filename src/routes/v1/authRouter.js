import express from 'express';
import { authController } from '../../controllers';
import validate from '../../middlewares/validate';
import { authValidation } from '../../validations';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', authController.login);

export default router;
