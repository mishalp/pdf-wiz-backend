import express from 'express'
import multer from 'multer';
import { deletePdf, myUploads, pdfDownload, pdfEdit, pdfUpload } from '../controllers/pdfController.js';
import { validateToken } from '../middlewares/validateToken.js';

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

router.post('/upload', upload.single('file'), validateToken, pdfUpload)

router.get('/get/:id', validateToken, pdfDownload)

router.post('/edit/:id', validateToken, pdfEdit)

router.get('/my-uploads', validateToken, myUploads)

router.delete('/delete/:id', validateToken, deletePdf)

export default router