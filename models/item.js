import mongoose from 'mongoose';

export const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category:{type:String, required:true},
    imagePath: { type: String, required: true }
}, { collection: 'items' })

export const Item = mongoose.model('Item', itemSchema)