import express from 'express'
import { EditName, EditPwd, FollowBatman, GetAllBatmans, GetBatmanDetails, GetMyFollowers, GetMyFollowings, Getmydetails, Login, Logout, Register, UploadDp } from '../Controllers/BatmanControllers.js'
import { VerifyToken } from '../VerifyToken/VerifyToken.js'
import { LoginValidation, RegisterValidation } from '../Validations/batmanValidations.js'
import { upload } from '../Multer/multer.js'


export const batmanRouter = express.Router()

batmanRouter.get('/', (req, res) => res.json(`Hello, From Server!`))

batmanRouter.post('/registerbatman', RegisterValidation, Register)

batmanRouter.post('/loginbatman', LoginValidation, Login)

batmanRouter.get('/logoutbatman', VerifyToken, Logout)

batmanRouter.put('/followbatman', VerifyToken, FollowBatman)

batmanRouter.get('/getbatmandetails/:batmanid', VerifyToken, GetBatmanDetails)

batmanRouter.put('/uploaddp', VerifyToken, upload.single('file'), UploadDp)

batmanRouter.put('/editname', VerifyToken, EditName)

batmanRouter.get('/getmyfollowings/:batmanid', VerifyToken, GetMyFollowings)

batmanRouter.get('/getmyfollowers/:batmanid', VerifyToken, GetMyFollowers)


batmanRouter.get('/allbatmans', VerifyToken, GetAllBatmans)

batmanRouter.get('/getmydetails', VerifyToken, Getmydetails)

batmanRouter.put('/editpwd', VerifyToken, EditPwd)