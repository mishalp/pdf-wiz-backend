import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true}
})

export default mongoose.model('GuestPdf', PdfSchema)