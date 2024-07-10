import batmanModel from "../Models/batmanmodel.js"
import { postModel } from "../Models/postmodel.js"

export const GetAllPosts = async (req, res) => {
    try {
        const loggedBatman = await batmanModel.findById({ _id: req.user._id })

        const myposts = await postModel.find({ Owner: req.user._id })


        const otherposts = []

        for (let fbatman of loggedBatman.Following) {

            const opost = await postModel.findOne({ Owner: fbatman })
            if (opost) otherposts.push(opost)

        }

        const allbatman = await batmanModel.find()


        res.json({ AllPosts: [...myposts, ...otherposts], Token: req.cookies.token, AllBatman: allbatman })

    } catch (error) {
        console.log(error);
    }
}


export const CreatePost = (req, res) => {

    const luser = req.user._id
    const { caption } = req.body
    const file = req.file

    postModel.create({ Caption: caption, Img: `https://batman-backend.onrender.com/Uploads/${file.filename}`, Owner: luser })
        .then(async createdPost => {
            try {
                const owner = await batmanModel.findById({ _id: luser })

                owner.Posts.push(createdPost._id)

                owner.save()

                res.json({ Msg: `Post Created` })

            } catch (error) {
                console.log(error);
            }
        })
        .catch(er => console.log(er))

}


export const LikeUnlikePost = async (req, res) => {
    const { postid } = req.params

    try {

        const targetpost = await postModel.findById({ _id: postid })

        if (targetpost.Likes.includes(req.user._id)) {
            const index = targetpost.Likes.indexOf(req.user._id)
            targetpost.Likes.splice(index, 1)
            targetpost.save()
            res.json({ Msg: `Post Unliked` })
        }

        else {
            targetpost.Likes.push(req.user._id)

            targetpost.save()

            res.json({ Msg: `Post Liked` })
        }


    } catch (error) {
        console.log(error);
    }

}

export const ViewLikes = (req, res) => {
    const { postid } = req.params

    postModel.findById({ _id: postid })
        .then(async targetpost => {

            const likedbatmans = []

            for (let lbatman of targetpost.Likes) {
                likedbatmans.push(await batmanModel.findById({ _id: lbatman }))
            }

            res.json({ Likes: likedbatmans })
        })
        .catch(er => console.log(er))
}


export const AddComment = async (req, res) => {

    const { postid } = req.params
    const { newcomment } = req.body

    try {

        if (!newcomment) res.json({ Msg: `Please type your comment first` })

        else {
            const targetpost = await postModel.findById({ _id: postid })

            targetpost.Comments.push({ CommentedBy: req.user._id, Comment: newcomment })

            targetpost.save()

            res.json({ Msg: `Comment added` })
        }

    } catch (error) {
        console.log(error);
    }
}


export const EditComment = async (req, res) => {

    const { updatedcomment } = req.body
    const { cid } = req.body
    const { postid } = req.params

    try {
        const targetpost = await postModel.findById({ _id: postid })

        const targetcomment = targetpost.Comments.find((cmnt) => cmnt._id == cid)

        // if (targetcomment.CommentedBy == req.user._id) {

        targetcomment.Comment = updatedcomment

        targetpost.save()

        res.json({ Msg: `Comment updated` })
        // }

        // else res.json({ Msg: `Invalid Request` })

    } catch (error) {
        console.log(error);
    }
}


export const DeleteComment = async (req, res) => {

    const { postid } = req.params
    const { cid } = req.body

    try {
        const targetpost = await postModel.findById({ _id: postid })

        // const targetcomment = targetpost.Comments.find((cmnt) => cmnt._id == cid)

        const newcomments = targetpost.Comments.filter((cmnt) => cmnt._id != cid)

        await postModel.findByIdAndUpdate({ _id: postid }, { Comments: newcomments })

        // const index = targetpost.Comments.indexOf(targetcomment)

        // targetpost.Comments.splice(index, 1)

        // targetpost.save()

        res.json({ Msg: `Comment deleted` })

    } catch (error) {
        console.log(error);
    }
}


export const DeletePost = async (req, res) => {
    const { postid } = req.params

    try {

        const removedPost = await postModel.findByIdAndDelete({ _id: postid })

        const lbatman = await batmanModel.findById({ _id: req.user._id })

        const i = lbatman.Posts.indexOf(postid)

        lbatman.Posts.splice(i, 1)

        lbatman.save()

        res.json({ Msg: `Post removed`, RemovedPost: removedPost })

    } catch (error) {
        console.log(error);
    }
}

export const EditPost = (req, res) => {

    const { postid } = req.params
    const file = req.file
    const { newcaption } = req.body

    postModel.findById({ _id: postid })
        .then(targetpost => {

            targetpost.Caption = newcaption

            targetpost.Img = `https://batman-backend.onrender.com/Uploads/${file.filename}`

            targetpost.save()

            res.json({ Msg: `Post Updated` })

        })
        .catch(er => console.log(er))
}

export const GetBatmanPosts = async (req, res) => {
    const { batmanid } = req.params

    try {
        const targetbatman = await batmanModel.findById({ _id: batmanid })

        const targetposts = []

        const batmans = await batmanModel.find()

        if (targetbatman.Followers.includes(req.user._id)) {

            for (let postid of targetbatman.Posts) {
                targetposts.push(await postModel.findById({ _id: postid }))
            }

            if (targetposts.length) res.json({ Access: true, Posts: targetposts, Batmans: batmans, Token: req.cookies.token })

            else res.json({ Access: true, NoPosts: true, Msg: `No posts from ${targetbatman.Name} yet`, Token: req.cookies.token })
        }

        else {
            if (batmanid == req.user._id) {
                for (let postid of targetbatman.Posts) {
                    targetposts.push(await postModel.findById({ _id: postid }))
                }

                if (targetposts.length) res.json({ Access: true, Posts: targetposts, Batmans: batmans, Token: req.cookies.token })

                else res.json({ Access: true, NoPosts: true, Msg: `No posts from ${targetbatman.Name} yet`, Token: req.cookies.token })
            }

            else res.json({ Access: false, Msg: `You need to follow ${targetbatman.Name} to view posts`, Token: req.cookies.token })
        }

    } catch (error) {
        console.log(error);
    }
}
