import jwt from 'jsonwebtoken'
import batmanModel from '../Models/batmanmodel.js'

export const VerifyToken = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) res.json(`Missing Token`)

    else {

        jwt.verify(token, "i_am_batman", async (err, decoded) => {
            if (err) res.json(err)

            else {
                try {
                    req.user = await batmanModel.findById({ _id: decoded._id })

                    next()

                } catch (error) {
                    console.log(error);
                }

            }
        })
    }
}