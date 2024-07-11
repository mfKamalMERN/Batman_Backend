import { body } from 'express-validator'

export const LoginValidation = [body('email').isEmail().withMessage(`Invalid Email`), body('pwd').isLength({ min: 6 }).withMessage("Min 6 chars required for password")]

export const RegisterValidation = [body('name').isLength({ min: 3 }).withMessage("min 3 chars required for name"), body('age').isNumeric().withMessage("Age must be a numeric value"), body('email').isEmail().withMessage("Invalid Email"), body('pwd').isLength({ min: 6 }).withMessage("Password must be 6 charas long").isAlphanumeric().withMessage(`Password must be alphanumeric `)]