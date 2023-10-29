import express from 'express'
import multer from 'multer';
import { pdfUpload } from '../controllers/pdfController.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })
const router = express.Router();

router.post('/upload', upload.single('file'), pdfUpload)

export default router