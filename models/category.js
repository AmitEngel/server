import mongoose from 'mongoose';

export const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
}, { collection: 'categories' })

export const Category = mongoose.model('Category', categorySchema)