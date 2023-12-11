import express from 'express';
import { authController } from '../../controllers';
import validate from '../../middlewares/validate';
import { authValidation } from '../../validations';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.get('/refresh-tokens', authController.refreshTokens);

export default router;

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: fake name
 *               lastName: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 firstName: test
 *                 lastName: test
 *                 email: test@gmail.com
 *                 password: "$2a$12$Jot8yLH8/PQuzQUj2FTgJus2OKb/Bz9tG9Hfh6eIcBMkpGiFZIv9e"
 *                 role: user
 *                 _id: 657485251fced21ce903510a
 *                 createdAt: '2023-12-09T15:17:57.988Z'
 *                 updatedAt: '2023-12-09T15:17:57.988Z'
 *                 __v: 0
 *               tokens:
 *                 access: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *                 refresh: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *       "400":
 *         description: Bad request
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       '200':
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 firstName: test
 *                 lastName: test
 *                 email: test@gmail.com
 *                 password: "$2a$12$Jot8yLH8/PQuzQUj2FTgJus2OKb/Bz9tG9Hfh6eIcBMkpGiFZIv9e"
 *                 role: user
 *                 _id: 657485251fced21ce903510a
 *                 createdAt: '2023-12-09T15:17:57.988Z'
 *                 updatedAt: '2023-12-09T15:17:57.988Z'
 *                 __v: 0
 *               tokens:
 *                 access: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *                 refresh: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *       '400':
 *         description: Bad request
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         description: 'NotFound'
 */

/**
 * @openapi
 * /auth/refresh-tokens:
 *   get:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               tokens:
 *                   access: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *                   refresh: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
 *       "401":
 *         description: Bad request
 */
