import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartId: { type:String, required:true },
    priceTotal: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    desiredShippingDate: { type: Date, required: true },
    lastFourDigits: { type: Number, required: true },
}, { collection: 'orders' })

export const Order = mongoose.model('Order', orderSchema)