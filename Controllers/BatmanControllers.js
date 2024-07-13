import { validationResult } from "express-validator";
import batmanModel from "../Models/batmanmodel.js";
import jwt from 'jsonwebtoken'
import { postModel } from "../Models/postmodel.js";

export const Register = async (req, res) => {
    const { name, age, email, pwd } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {
        try {
            const fu = await batmanModel.findOne({ Email: email })

            if (fu) res.json(`${fu.Name} is already registered with this Email`)

            else {

                const createduser = await batmanModel.create({ Name: name, Age: age, Email: email, Password: pwd })
                res.json(`${createduser.Name} has been created. Proceed to login new batman !`)
            }

        } catch (error) {
            console.log(error);
        }
    }

}


export const Login = (req, res) => {

    const { email, pwd } = req.body
    const errorV = validationResult(req)
    const token = req.cookies.token

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {

        if (token) {

            jwt.verify(token, "i_am_batman", async (err, decoded) => {
                if (err) res.json({ Error: err })
                else {
                    try {
                        const luser = await batmanModel.findById({ _id: decoded._id })

                        res.json({ AlreadyLoggedin: true, Msg: `Logged in Already`, LoggedBatman: luser })

                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        }
        else {
            batmanModel.findOne({ Email: email })
                .then(batman => {
                    if (batman) {
                        if (batman.Password === pwd) {

                            const token = jwt.sign({ _id: batman._id }, "i_am_batman", { expiresIn: "24h" })

                            res.cookie(`token`, token)

                            res.json({ Msg: `Hello Batman ${batman.Name} !`, LoggedIn: true, Token: token, LoggedBatman: [batman] })
                        }

                        else res.json({ Msg: `Incorrect Password`, LoggedIn: false })
                    }
                    else res.json({ Msg: `No Such Batman Exists in Batman Database`, LoggedIn: false })
                })
                .catch(er => console.log(er))
        }
    }
}


export const Logout = (req, res) => {
    res.clearCookie('token')
    res.json({ Msg: `Logged Out Successfully` })
}


export const FollowBatman = async (req, res) => {

    const { batmantofollowid } = req.body

    if (req.user._id == batmantofollowid) res.json({ Msg: `Invalid request` })

    else {

        try {
            const loggedbatman = await batmanModel.findById({ _id: req.user._id })

            const batmantofollow = await batmanModel.findById({ _id: batmantofollowid })


            if (loggedbatman.Following.includes(batmantofollowid)) {

                const index = loggedbatman.Following.indexOf(batmantofollowid)

                loggedbatman.Following.splice(index, 1)

                loggedbatman.save()

                const i = batmantofollow.Followers.indexOf(req.user._id)

                batmantofollow.Followers.splice(i, 1)

                batmantofollow.save()

                res.json({ Msg: `Unfollowed User ${batmantofollow.Name}` })
            }

            else {

                loggedbatman.Following.push(batmantofollowid)

                loggedbatman.save()

                batmantofollow.Followers.push(req.user._id)

                batmantofollow.save()

                res.json({ Msg: `Followed User ${batmantofollow.Name}` })

            }
        }
        catch (error) {
            console.log(error)
        }
    }

}


export const GetBatmanDetails = (req, res) => {
    const { batmanid } = req.params
    batmanModel.findById({ _id: batmanid })
        .then(batmandetails => res.json({ LoggedBatman: [batmandetails], Token: req.cookies.token }))
        .catch(er => console.log(er))

}


export const UploadDp = async (req, res) => {
    const file = req.file
    const path = `https://batman-backend.onrender.com/Uploads/${file.filename}`
    try {
        const batman = await batmanModel.findByIdAndUpdate({ _id: req.user._id }, { DP: path })

        res.json({ Msg: `DP updated for ${batman.Name}`, Lbatman: [batman] })

    } catch (error) {
        console.log(error);
    }
}

export const GetMyFollowings = async (req, res) => {
    const { batmanid } = req.params

    try {
        const lbatman = await batmanModel.findById({ _id: batmanid })

        const followingbatmans = []

        for (let fbatman of lbatman.Following) {
            followingbatmans.push(await batmanModel.findById({ _id: fbatman }))
        }

        res.json({ Followings: followingbatmans })

    } catch (error) {
        console.log(error);

    }

}

export const GetMyFollowers = (req, res) => {
    const { batmanid } = req.params
    batmanModel.findById({ _id: batmanid })
        .then(async lbatman => {
            const followerbatmans = []

            for (let fbatman of lbatman.Followers) {
                followerbatmans.push(await batmanModel.findById({ _id: fbatman }))
            }

            res.json({ Followers: followerbatmans })
        })
        .catch(er => console.log(er))
}

export const EditName = async (req, res) => {
    const { newname } = req.body

    try {
        const batman = await batmanModel.findByIdAndUpdate({ _id: req.user._id }, { Name: newname })

        res.json(`Name updated for ${batman.Name} `)
    } catch (error) {
        console.log(error);
    }
}

export const GetAllBatmans = async (req, res) => {
    try {
        const allbatmans = await batmanModel.find()

        res.json({ Token: req.cookies.token, Allbatmans: allbatmans })

    } catch (error) {
        console.log(error);
    }
}

export const Getmydetails = async (req, res) => {
    try {
        const me = await batmanModel.findById({ _id: req.user._id })
        res.json([me])
    } catch (error) {
        console.log(error);
    }
}

export const EditPwd = (req, res) => {
    const { oldpwd, newpwd, confirmpwd } = req.body

    batmanModel.findById({ _id: req.user._id })
        .then(batman => {

            if (batman.Password !== oldpwd) res.json({ Msg: `Old Password is incorrect`, Updated: false })

            else if (newpwd !== confirmpwd) res.json({ Msg: `passwords didn't match`, Updated: false })

            else {
                batman.Password = newpwd
                batman.save()
                res.json({ Msg: `Password successfully updated for ${batman.Name}`, Updated: true })
            }
        })
        .catch(er => console.log(er))
}

// export const DeleteAccount = (req, res) => {
//     batmanModel.findByIdAndDelete({ _id: req.user._id })
//         .then(batman => {
//             for (let pid of batman.Posts) {
//                 postModel.findByIdAndDelete({ _id: pid })
//             }
//             res.json({ Msg: `Account deleted for ${batman.Name}` })
//         })
//         .catch(er => console.log(er))
// }