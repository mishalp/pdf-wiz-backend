import express from 'express'
import { userSignIn, userSignUp } from '../controllers/userContorller.js';
import { validateToken } from '../middlewares/validateToken.js';
const router = express.Router();

router.post('/sign-up', userSignUp)

router.post('/sign-in', userSignIn)

router.get('/verify', validateToken, (req, res, next) => {
    res.status(200).json({ name: req.name, id: req.userId })
})

export default router