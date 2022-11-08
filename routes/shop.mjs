import express from 'express';
import { extractFile } from '../middlewares/image-upload.mjs'
import { checkAuth } from '../middlewares/check-auth.mjs'
import {
    getItems,
    getItemById,
    addItemToShop,
    updateItem,
    deleteItem,
    getCart,
    addItemToCart,
    createCart,
    getOrdersByUserId,
    orderItems,
    deleteItemFromCart
} from '../controllers/shop.mjs';

const shopRoute = express.Router()

shopRoute.get('/', getItems)
shopRoute.use(checkAuth)
shopRoute.get('/edit/:itemId', getItemById)
shopRoute.post('/', extractFile, addItemToShop)
shopRoute.put('/edit/:itemId', extractFile, updateItem)
shopRoute.delete('/delete/:itemId', deleteItem)
shopRoute.get('/cart', getCart)
shopRoute.post('/cart', createCart)
shopRoute.put('/:cartId', addItemToCart)
shopRoute.delete('/:cartId/:itemId', deleteItemFromCart)
shopRoute.get('/order/:userId', getOrdersByUserId)
shopRoute.post('/order', orderItems)

export default shopRoute