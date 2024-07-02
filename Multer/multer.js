import multer from 'multer'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'Public/Uploads')
    },

    filename: (req, file, cb) => {
        return cb(null, Date.now() + file.originalname)
    }
})


export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        if (file.mimetype === 'image/jpg' || file.mimetype === "image/jpeg" || file.mimetype === 'image/png') {
            cb(null, true)
        }

        else {

            cb(null, false)

            return cb(new Error("Only .png, .jpg and .jpeg format allowed"))

        }
    }
})
