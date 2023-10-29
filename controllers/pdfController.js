
export const pdfUpload = async (req, res, next) => {
    res.send({success: true, file: req.file.filename})
}