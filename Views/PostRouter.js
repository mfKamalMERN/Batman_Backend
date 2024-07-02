import express from 'express'
import { VerifyToken } from '../VerifyToken/VerifyToken.js'
import { AddComment, CreatePost, DeleteComment, DeletePost, EditComment, EditPost, GetAllPosts, GetBatmanPosts, LikeUnlikePost, ViewLikes } from '../Controllers/PostController.js'
import { upload } from '../Multer/multer.js'

export const postRouter = express.Router()


postRouter.get('/getallposts', VerifyToken, GetAllPosts)

postRouter.get('/getbatmanposts/:batmanid', VerifyToken, GetBatmanPosts)

postRouter.post('/createpost', VerifyToken, upload.single('file'), CreatePost)

postRouter.put('/likeunlikepost/:postid', VerifyToken, LikeUnlikePost)

postRouter.get('/viewlikes/:postid', VerifyToken, ViewLikes)

postRouter.post('/addcomment/:postid', VerifyToken, AddComment)

postRouter.put('/editcomment/:postid', VerifyToken, EditComment)

postRouter.put('/removecomment/:postid', VerifyToken, DeleteComment)

postRouter.put('/editpost/:postid', VerifyToken, upload.single('file'), EditPost)

postRouter.delete('/removepost/:postid', VerifyToken, DeletePost)
