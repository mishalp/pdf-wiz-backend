import express from 'express'
import multer from 'multer';
import { pdfDownload, pdfEdit, pdfUpload } from '../controllers/pdfController.js';
import fs from 'fs'
import * as url from 'url';
import path from 'path';
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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

router.get('/get/:id', pdfDownload)

router.post('/edit/:id', pdfEdit)

export default router