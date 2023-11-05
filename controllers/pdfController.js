import fs from 'fs'
import * as url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import Pdf from '../models/pdfModel.js'
import { PDFDocument } from 'pdf-lib';
import { log } from 'console';

export const pdfUpload = async (req, res, next) => {
    const user = req.userId
    try {
        const id = await Pdf.create({ name: req.file.filename, user })
        res.send({ success: true, id: id._id })
    } catch (error) {
        next(error);
    }
}

export const pdfDownload = async (req, res, next) => {
    const id = req.params.id;
    const user = req.userId
    try {
        const pdf = await Pdf.findById(id);
        if(pdf.user !== user) next({statusCode: 403, message: 'Unautherized User'})
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
    const user = req.userId
    const { pages } = req.body;
    try {
        const donor = await Pdf.findById(id);
        if(donor.user !== user) next({statusCode: 403, message: 'Unautherized User'})
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

export const myUploads = async(req, res, next) => {
    const user = req.userId
    if(user === 'guest') next({statusCode: 403, message: 'Unautherized User'})
    try {
        const myPdfs = await Pdf.find({user: user});
        const myUploads = myPdfs.map(item=>{
            return {name: item.name, id: item._id, url: `${process.env.SERVER}/files/${item.name}`}
        })
        return res.status(200).send({pdfs: myUploads})
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const deletePdf = async(req, res, next) => {
    const user = req.userId
    if(user === 'guest') next({statusCode: 403, message: 'Unautherized User'})
    const id = req.params.id
    try {
        const pdf = await Pdf.findByIdAndRemove(id)
        fs.unlink(path.join(__dirname + '..' + `/files/${pdf.name}`), (err)=>{
            if(err) next(err)
            return res.status(200).send({success: true})
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}