import fs from 'fs'
import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import GuestPdf from '../models/pdfModel.js'
import { PDFDocument } from 'pdf-lib';

export const pdfUpload = async (req, res, next) => {
    try {
        const id = await GuestPdf.create({ name: req.file.filename })
        res.send({ success: true, id: id._id })
    } catch (error) {
        next(error);
    }
}

export const pdfDownload = async (req, res, next) => {
    const id = req.params.id;
    try {
        const pdf = await GuestPdf.findById(id);
        if (!pdf) next({ statusCode: 400, message: "pdf not found" })
        const pdfBytes = fs.readFileSync(path.join(__dirname + '..' + `/files/${pdf.name}`))
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const pages = pdfDoc.getPageCount()
        res.send({ success: true, url: `${process.env.SERVER}/files/${pdf.name}`, pages })
    } catch (error) {
        next(error)
    }
}

export const pdfEdit = async (req, res, next) => {
    const id = req.params.id;
    const { pages } = req.body;
    try {
        const donor = await GuestPdf.findById(id);
        if (!donor) next({ statusCode: 400, message: "pdf not found" })
        const donorPdfBytes = fs.readFileSync(path.join(__dirname + '..' + `/files/${donor.name}`))
        const donorPdf = await PDFDocument.load(donorPdfBytes)
        const pdfDoc = await PDFDocument.create()
        const pageArr = await pdfDoc.copyPages(donorPdf, pages)
        pageArr.forEach(item => pdfDoc.addPage(item))
        const pdfBytes = await pdfDoc.save()
        let prefix = Date.now()
        fs.writeFileSync(path.join(__dirname + '..' + `/edits/${id}_${prefix}.pdf`), pdfBytes)
        res.status(200).send({success: true, url: `${process.env.SERVER}/edits/${id}_${prefix}.pdf`})
    } catch (error) {
        next(error)
    }
}