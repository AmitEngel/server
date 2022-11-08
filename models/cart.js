import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required:true},
    quantity: { type: Number, required: true },
    priceTotal: { type: Number, required: true },
    name: { type: String, required: true },
    imagePath: { type: String, required: true }
})

const cartSchema = mongoose.Schema({
    items: { type: [cartItemSchema] },
    dateCreated:{type:Date, required:true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    
}, { collection: 'carts' })

export const Cart = mongoose.model('Cart', cartSchema)