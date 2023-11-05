import { body, validationResult } from "express-validator";
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const userSignUp = [
    body("name")
        .trim()
        .isLength({min: 1}),
    body("email")
        .trim()
        .isEmail(),
    body("password")
        .isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = validationResult(req)
        try {
            if (!errors.isEmpty() && errors.errors[0].path === 'name') {
                return res.status(400).send('Name is required. Please try again.')
            }
            if (!errors.isEmpty() && errors.errors[0].path === 'email') {
                return res.status(400).send('Invalid email address. Please try again.')
            }
            if (!errors.isEmpty() && errors.errors[0].path === 'password') {
                return res
                    .status(400)
                    .send('Password must be longer than 6 characters.')
            }

            const { email, password, name } = req.body;
            const isEmail = await User.findOne({ email: email });
            if (isEmail) return res.status(401).json({ error: { message: "Email already exist" } })

            const user = await User.create({ email, password, name })
            const payload = { id: user._id, email: user.email, name: user.name }
            jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) return res.status(500).json({ err })
                return res.status(200).json({ token, email: user.email, name: user.name });
            })
        } catch (err) {
            next(err)
        }
    }

]

export const userSignIn = [
    body("email")
        .trim()
        .isEmail(),
    body("password")
        .isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = validationResult(req)
        try {
            if (!errors.isEmpty() && errors.errors[0].path === 'email') {
                return res.status(400).send('Invalid email address. Please try again.')
            }
            if (!errors.isEmpty() && errors.errors[0].path === 'password') {
                return res
                    .status(400)
                    .send('Password must be longer than 6 characters.')
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) return res.status(401).json({ error: { message: "Email not registered" } })
            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if(!isPasswordMatch) return res.status(401).json({error:{message: "Incorrect password"}});

            const payload = { id: user._id, email: user.email, name: user.name }
            jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) return res.status(500).json({ err })
                return res.status(200).json({ token, email: user.email, name: user.name });
            })
        } catch (err) {
            next(err)
        }
    }

]